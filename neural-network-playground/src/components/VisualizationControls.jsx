import React from 'react';
import { useNetworkStore } from '../store/networkStore';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/VisualizationControls.css';

export default function VisualizationControls() {
  const {
    showWeights,
    showActivations,
    showGradients,
    animationSpeed,
    toggleWeights,
    toggleActivations,
    toggleGradients,
    setAnimationSpeed
  } = useNetworkStore();
  
  return (
    <div className="visualization-controls">
      <div className="panel-section">
        <h3>3D Visualization</h3>
        
        <div className="control-group">
          <div className="toggle-item">
            <button
              className={`toggle-btn ${showWeights ? 'active' : ''}`}
              onClick={toggleWeights}
            >
              {showWeights ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>Show Weights</span>
            </button>
            <small className="toggle-description">
              Display connection strengths between neurons
            </small>
          </div>
          
          <div className="toggle-item">
            <button
              className={`toggle-btn ${showActivations ? 'active' : ''}`}
              onClick={toggleActivations}
            >
              {showActivations ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>Show Activations</span>
            </button>
            <small className="toggle-description">
              Animate signal flow through the network
            </small>
          </div>
          
          <div className="toggle-item">
            <button
              className={`toggle-btn ${showGradients ? 'active' : ''}`}
              onClick={toggleGradients}
            >
              {showGradients ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>Show Gradients</span>
            </button>
            <small className="toggle-description">
              Visualize backpropagation gradients
            </small>
          </div>
        </div>
        
        <div className="control-group">
          <label>
            Animation Speed: {animationSpeed.toFixed(1)}x
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="slider"
            />
          </label>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Camera Controls</h3>
        
        <div className="controls-info">
          <div className="control-hint">
            <strong>🖱️ Left Click + Drag:</strong> Rotate view
          </div>
          <div className="control-hint">
            <strong>🖱️ Right Click + Drag:</strong> Pan view
          </div>
          <div className="control-hint">
            <strong>🖱️ Scroll:</strong> Zoom in/out
          </div>
          <div className="control-hint">
            <strong>🖱️ Click Node:</strong> Select neuron
          </div>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Color Legend</h3>
        
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'linear-gradient(to right, #ff6633, #ffaa66)' }}></div>
            <span>Positive Activation</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'linear-gradient(to right, #3366ff, #6699ff)' }}></div>
            <span>Negative Activation</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'linear-gradient(to right, #33ff66, #66ffaa)' }}></div>
            <span>Positive Weight</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'linear-gradient(to right, #ff3366, #ff6699)' }}></div>
            <span>Negative Weight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
