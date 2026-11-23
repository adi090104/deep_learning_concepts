import React, { useState } from 'react';
import { useNetworkStore } from '../store/networkStore';
import { Plus, Minus, Edit2 } from 'lucide-react';
import '../styles/ArchitectureEditor.css';

export default function ArchitectureEditor() {
  const {
    network,
    addLayer,
    removeLayer,
    changeLayerNodes,
    setActivationFunction
  } = useNetworkStore();
  
  const [editingLayer, setEditingLayer] = useState(null);
  const [nodeCount, setNodeCount] = useState('');
  
  const architecture = network.architecture;
  
  const handleEditLayer = (layerIndex) => {
    setEditingLayer(layerIndex);
    setNodeCount(architecture[layerIndex].toString());
  };
  
  const handleSaveLayer = (layerIndex) => {
    const count = parseInt(nodeCount);
    if (count > 0 && count <= 50) {
      changeLayerNodes(layerIndex, count);
    }
    setEditingLayer(null);
  };
  
  const handleAddLayer = (position) => {
    addLayer(position, 4);
  };
  
  const handleRemoveLayer = (position) => {
    if (architecture.length > 2) {
      removeLayer(position);
    }
  };
  
  return (
    <div className="architecture-editor">
      <div className="panel-section">
        <h3>Network Architecture</h3>
        
        <div className="architecture-list">
          {architecture.map((nodes, index) => (
            <div key={index} className="layer-item">
              <div className="layer-info">
                <span className="layer-label">
                  {index === 0 ? 'Input' : index === architecture.length - 1 ? 'Output' : `Hidden ${index}`}
                </span>
                
                {editingLayer === index ? (
                  <div className="node-editor">
                    <input
                      type="number"
                      value={nodeCount}
                      onChange={(e) => setNodeCount(e.target.value)}
                      min="1"
                      max="50"
                      className="node-input"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveLayer(index);
                        }
                      }}
                    />
                    <button 
                      className="btn-icon"
                      onClick={() => handleSaveLayer(index)}
                    >
                      ✓
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={() => setEditingLayer(null)}
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div className="node-count">
                    <span className="node-value">{nodes} nodes</span>
                    <button 
                      className="btn-icon"
                      onClick={() => handleEditLayer(index)}
                      title="Edit node count"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="layer-actions">
                {index > 0 && index < architecture.length - 1 && (
                  <button
                    className="btn-icon btn-danger-icon"
                    onClick={() => handleRemoveLayer(index)}
                    title="Remove layer"
                    disabled={architecture.length <= 2}
                  >
                    <Minus size={14} />
                  </button>
                )}
                
                {index < architecture.length - 1 && (
                  <button
                    className="btn-icon btn-success-icon"
                    onClick={() => handleAddLayer(index + 1)}
                    title="Add layer after"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="architecture-summary">
          <strong>Total Layers:</strong> {architecture.length} <br />
          <strong>Total Parameters:</strong>{' '}
          {network.weights.reduce((sum, w) => sum + w.rows * w.cols, 0) +
           network.biases.reduce((sum, b) => sum + b.rows, 0)}
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Activation Function</h3>
        
        <select
          className="select"
          onChange={(e) => setActivationFunction(e.target.value)}
          defaultValue="sigmoid"
        >
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">Tanh</option>
          <option value="relu">ReLU</option>
          <option value="leakyRelu">Leaky ReLU</option>
          <option value="linear">Linear</option>
        </select>
        
        <div className="activation-info">
          <small>
            Changes the activation function used in all layers.
            Affects how neurons process and pass information.
          </small>
        </div>
      </div>
    </div>
  );
}
