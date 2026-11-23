import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { useNetworkStore } from '../store/networkStore';
import * as THREE from 'three';

// Individual neuron/node component
function NetworkNode({ position, value, isActive, layerIndex, nodeIndex, onClick }) {
  const meshRef = useRef();
  const targetScale = useRef(1);
  
  // Animate activation
  useEffect(() => {
    targetScale.current = isActive ? 1.5 : 1;
  }, [isActive]);
  
  useFrame(() => {
    if (meshRef.current) {
      // Smooth scale animation
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale.current - currentScale) * 0.1;
      meshRef.current.scale.set(newScale, newScale, newScale);
      
      // Rotate on hover
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  // Color based on activation value
  const color = useMemo(() => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return new THREE.Color(intensity, intensity * 0.5, 0.2);
    } else {
      return new THREE.Color(0.2, intensity * 0.5, intensity);
    }
  }, [value]);
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(layerIndex, nodeIndex)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Value label */}
      <Html
        position={[0, 0.5, 0]}
        center
        style={{
          color: 'white',
          fontSize: '10px',
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 0 3px black'
        }}
      >
        {value.toFixed(2)}
      </Html>
    </group>
  );
}

// Connection/weight line between nodes
function NetworkConnection({ start, end, weight, isVisible }) {
  const lineRef = useRef();
  
  // Color and thickness based on weight
  const color = useMemo(() => {
    const intensity = Math.abs(weight);
    if (weight > 0) {
      return new THREE.Color(0.3, 1, 0.3);
    } else {
      return new THREE.Color(1, 0.3, 0.3);
    }
  }, [weight]);
  
  const thickness = useMemo(() => {
    return Math.abs(weight) * 0.05 + 0.01;
  }, [weight]);
  
  if (!isVisible) return null;
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        linewidth={thickness}
        opacity={Math.min(Math.abs(weight), 0.8)}
        transparent
      />
    </line>
  );
}

// Activation flow particle
function ActivationParticle({ start, end, delay, speed = 1 }) {
  const meshRef = useRef();
  const progress = useRef(0);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      progress.current += delta * speed;
      
      if (progress.current > 1 + delay) {
        progress.current = 0;
      }
      
      const t = Math.max(0, Math.min(1, progress.current - delay));
      
      meshRef.current.position.x = start[0] + (end[0] - start[0]) * t;
      meshRef.current.position.y = start[1] + (end[1] - start[1]) * t;
      meshRef.current.position.z = start[2] + (end[2] - start[2]) * t;
      
      meshRef.current.scale.setScalar(Math.sin(t * Math.PI) * 0.5 + 0.5);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
    </mesh>
  );
}

// Main 3D network visualization
function NetworkScene() {
  const network = useNetworkStore((state) => state.network);
  const showWeights = useNetworkStore((state) => state.showWeights);
  const showActivations = useNetworkStore((state) => state.showActivations);
  const selectNode = useNetworkStore((state) => state.selectNode);
  const selectedLayer = useNetworkStore((state) => state.selectedLayer);
  const selectedNode = useNetworkStore((state) => state.selectedNode);
  
  const networkState = network.getNetworkState();
  const { architecture, layerOutputs, weights } = networkState;
  
  // Calculate node positions
  const nodePositions = useMemo(() => {
    const positions = [];
    const layerSpacing = 4;
    const maxNodes = Math.max(...architecture);
    
    architecture.forEach((layerSize, layerIndex) => {
      const layerNodes = [];
      const nodeSpacing = 1.5;
      const layerHeight = (layerSize - 1) * nodeSpacing;
      
      for (let nodeIndex = 0; nodeIndex < layerSize; nodeIndex++) {
        const x = (layerIndex - (architecture.length - 1) / 2) * layerSpacing;
        const y = (nodeIndex - (layerSize - 1) / 2) * nodeSpacing;
        const z = 0;
        
        layerNodes.push([x, y, z]);
      }
      
      positions.push(layerNodes);
    });
    
    return positions;
  }, [architecture]);
  
  // Generate connection data
  const connections = useMemo(() => {
    const conns = [];
    
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const currentLayer = nodePositions[i];
      const nextLayer = nodePositions[i + 1];
      const weightMatrix = weights[i];
      
      if (weightMatrix) {
        currentLayer.forEach((startPos, startIdx) => {
          nextLayer.forEach((endPos, endIdx) => {
            const weight = weightMatrix.data[endIdx][startIdx];
            conns.push({
              start: startPos,
              end: endPos,
              weight,
              layerIndex: i
            });
          });
        });
      }
    }
    
    return conns;
  }, [nodePositions, weights]);
  
  // Generate activation particles
  const activationParticles = useMemo(() => {
    if (!showActivations || connections.length === 0) return [];
    
    const particles = [];
    
    // Sample some connections for particles
    const sampledConnections = connections.filter((_, idx) => idx % 3 === 0);
    
    sampledConnections.forEach((conn, idx) => {
      particles.push({
        ...conn,
        delay: idx * 0.1,
        speed: 0.5
      });
    });
    
    return particles;
  }, [connections, showActivations]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Nodes */}
      {nodePositions.map((layer, layerIndex) =>
        layer.map((position, nodeIndex) => {
          const value = layerOutputs[layerIndex] 
            ? layerOutputs[layerIndex][nodeIndex] 
            : 0;
          const isActive = selectedLayer === layerIndex && selectedNode === nodeIndex;
          
          return (
            <NetworkNode
              key={`node-${layerIndex}-${nodeIndex}`}
              position={position}
              value={value}
              isActive={isActive}
              layerIndex={layerIndex}
              nodeIndex={nodeIndex}
              onClick={selectNode}
            />
          );
        })
      )}
      
      {/* Connections */}
      {showWeights && connections.map((conn, idx) => (
        <NetworkConnection
          key={`conn-${idx}`}
          start={conn.start}
          end={conn.end}
          weight={conn.weight}
          isVisible={showWeights}
        />
      ))}
      
      {/* Activation particles */}
      {showActivations && activationParticles.map((particle, idx) => (
        <ActivationParticle
          key={`particle-${idx}`}
          start={particle.start}
          end={particle.end}
          delay={particle.delay}
          speed={particle.speed}
        />
      ))}
      
      {/* Grid helper */}
      <gridHelper args={[20, 20, '#444444', '#222222']} position={[0, -5, 0]} />
    </>
  );
}

export default function NetworkVisualization3D() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a0a' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />
        <NetworkScene />
      </Canvas>
    </div>
  );
}
