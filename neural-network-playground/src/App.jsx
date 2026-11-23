import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NetworkVisualization3D from './components/NetworkVisualization3D';
import ControlPanel from './components/ControlPanel';
import ArchitectureEditor from './components/ArchitectureEditor';
import DatasetSelector from './components/DatasetSelector';
import VisualizationControls from './components/VisualizationControls';
import MetricsDisplay from './components/MetricsDisplay';
import { Menu, X, Info } from 'lucide-react';
import './styles/App.css';

function App() {
  const [activePanel, setActivePanel] = useState('control');
  const [showInfo, setShowInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const panels = [
    { id: 'control', label: 'Training', component: ControlPanel },
    { id: 'architecture', label: 'Architecture', component: ArchitectureEditor },
    { id: 'dataset', label: 'Dataset', component: DatasetSelector },
    { id: 'visualization', label: 'Visualization', component: VisualizationControls },
    { id: 'metrics', label: 'Metrics', component: MetricsDisplay }
  ];
  
  const ActiveComponent = panels.find(p => p.id === activePanel)?.component;
  
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="app-title">Neural Network Playground</h1>
            <span className="app-subtitle">Interactive 3D Visualization</span>
          </div>
          
          <button
            className="info-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info size={20} />
          </button>
        </div>
      </header>
      
      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>About Neural Network Playground</h2>
                <button onClick={() => setShowInfo(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <section>
                  <h3>What is this?</h3>
                  <p>
                    An interactive 3D visualization tool for understanding how neural networks work.
                    Built entirely from scratch without high-level ML libraries - every forward pass,
                    backward pass, and gradient calculation is implemented manually.
                  </p>
                </section>
                
                <section>
                  <h3>Features</h3>
                  <ul>
                    <li>Build custom network architectures by adding/removing layers and nodes</li>
                    <li>Watch activations flow through the network in real-time</li>
                    <li>Visualize weights and their strengths as connections</li>
                    <li>See gradient descent in action during backpropagation</li>
                    <li>Train on different datasets (XOR, Circle, Spiral)</li>
                    <li>Adjust learning rate and training speed dynamically</li>
                    <li>Export and import trained networks</li>
                  </ul>
                </section>
                
                <section>
                  <h3>How to Use</h3>
                  <ol>
                    <li><strong>Training:</strong> Click "Start Training" to begin. Watch the network learn!</li>
                    <li><strong>Architecture:</strong> Add/remove layers, change node counts</li>
                    <li><strong>Dataset:</strong> Switch between different learning problems</li>
                    <li><strong>Visualization:</strong> Toggle weights, activations, and gradients</li>
                    <li><strong>Metrics:</strong> Monitor training progress and loss curves</li>
                  </ol>
                </section>
                
                <section>
                  <h3>Understanding the Visualization</h3>
                  <ul>
                    <li><strong>Nodes (Spheres):</strong> Individual neurons. Color intensity shows activation strength</li>
                    <li><strong>Lines:</strong> Connections/weights between neurons. Green = positive, Red = negative</li>
                    <li><strong>Particles:</strong> Activation signals flowing through the network</li>
                    <li><strong>Numbers:</strong> Current activation value of each neuron</li>
                  </ul>
                </section>
                
                <section>
                  <h3>Educational Purpose</h3>
                  <p>
                    This playground helps you understand what's happening inside a neural network:
                  </p>
                  <ul>
                    <li>How neurons process and transform information</li>
                    <li>How weights control information flow</li>
                    <li>How backpropagation updates the network</li>
                    <li>Why architecture choices matter</li>
                    <li>How different datasets require different approaches</li>
                  </ul>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="app-content">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="sidebar"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Panel Tabs */}
              <div className="panel-tabs">
                {panels.map(panel => (
                  <button
                    key={panel.id}
                    className={`panel-tab ${activePanel === panel.id ? 'active' : ''}`}
                    onClick={() => setActivePanel(panel.id)}
                  >
                    {panel.label}
                  </button>
                ))}
              </div>
              
              {/* Active Panel Content */}
              <div className="panel-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {ActiveComponent && <ActiveComponent />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Visualization */}
        <main className="main-view">
          <NetworkVisualization3D />
        </main>
      </div>
    </div>
  );
}

export default App;
