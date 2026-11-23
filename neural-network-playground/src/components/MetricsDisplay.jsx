import React, { useRef, useEffect } from 'react';
import { useNetworkStore } from '../store/networkStore';
import '../styles/MetricsDisplay.css';

export default function MetricsDisplay() {
  const network = useNetworkStore((state) => state.network);
  const currentEpoch = useNetworkStore((state) => state.currentEpoch);
  const canvasRef = useRef(null);
  
  const history = network.history;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    if (history.loss.length < 2) return;
    
    // Find min/max for scaling
    const maxLoss = Math.max(...history.loss);
    const minLoss = Math.min(...history.loss);
    const range = maxLoss - minLoss || 1;
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw loss curve
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const pointSpacing = width / Math.max(history.loss.length - 1, 1);
    
    history.loss.forEach((loss, idx) => {
      const x = idx * pointSpacing;
      const y = height - ((loss - minLoss) / range) * (height - 20) - 10;
      
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Max: ${maxLoss.toFixed(4)}`, 5, 15);
    ctx.fillText(`Min: ${minLoss.toFixed(4)}`, 5, height - 5);
    ctx.fillText(`Current: ${history.loss[history.loss.length - 1].toFixed(4)}`, width - 120, 15);
    
  }, [history.loss]);
  
  // Calculate some statistics
  const avgLoss = history.loss.length > 0
    ? history.loss.reduce((a, b) => a + b, 0) / history.loss.length
    : 0;
    
  const recentLoss = history.loss.length > 0
    ? history.loss.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, history.loss.length)
    : 0;
  
  return (
    <div className="metrics-display">
      <div className="panel-section">
        <h3>Training Metrics</h3>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Current Epoch</div>
            <div className="metric-value large">{currentEpoch}</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Current Loss</div>
            <div className="metric-value">
              {history.loss.length > 0 
                ? history.loss[history.loss.length - 1].toFixed(6)
                : '0.000000'}
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Average Loss</div>
            <div className="metric-value">{avgLoss.toFixed(6)}</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Recent Loss (10)</div>
            <div className="metric-value">{recentLoss.toFixed(6)}</div>
          </div>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Loss Curve</h3>
        
        <div className="chart-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        
        {history.loss.length === 0 && (
          <div className="chart-placeholder">
            Start training to see the loss curve
          </div>
        )}
      </div>
      
      <div className="panel-section">
        <h3>Network Info</h3>
        
        <div className="info-list">
          <div className="info-item">
            <span className="info-label">Architecture:</span>
            <span className="info-value">{network.architecture.join(' → ')}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Weights:</span>
            <span className="info-value">
              {network.weights.reduce((sum, w) => sum + w.rows * w.cols, 0)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Biases:</span>
            <span className="info-value">
              {network.biases.reduce((sum, b) => sum + b.rows, 0)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Learning Rate:</span>
            <span className="info-value">{network.learningRate.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
