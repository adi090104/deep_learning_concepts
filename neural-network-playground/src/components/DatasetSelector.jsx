import React from 'react';
import { useNetworkStore } from '../store/networkStore';
import '../styles/DatasetSelector.css';

export default function DatasetSelector() {
  const { datasetType, changeDataset, trainingData, predictInput } = useNetworkStore();
  
  const datasets = [
    {
      id: 'xor',
      name: 'XOR Problem',
      description: 'Classic non-linearly separable problem. Tests the network\'s ability to learn XOR logic.',
      samples: 4
    },
    {
      id: 'circle',
      name: 'Circle Classification',
      description: 'Points inside vs outside a circle. Tests radial decision boundaries.',
      samples: 100
    },
    {
      id: 'spiral',
      name: 'Spiral Pattern',
      description: 'Two intertwined spirals. Complex non-linear pattern recognition.',
      samples: 100
    }
  ];
  
  return (
    <div className="dataset-selector">
      <div className="panel-section">
        <h3>Training Dataset</h3>
        
        <div className="dataset-list">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`dataset-card ${datasetType === dataset.id ? 'active' : ''}`}
              onClick={() => changeDataset(dataset.id)}
            >
              <div className="dataset-header">
                <h4>{dataset.name}</h4>
                {datasetType === dataset.id && (
                  <span className="active-badge">Active</span>
                )}
              </div>
              <p className="dataset-description">{dataset.description}</p>
              <div className="dataset-info">
                <span className="info-label">Samples:</span>
                <span className="info-value">{dataset.samples}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Dataset Preview</h3>
        
        <div className="dataset-preview">
          <div className="preview-grid">
            {trainingData.inputs.slice(0, 8).map((input, idx) => (
              <div key={idx} className="preview-item">
                <div className="preview-input">
                  [{input.map(v => v.toFixed(2)).join(', ')}]
                </div>
                <div className="preview-arrow">→</div>
                <div className="preview-output">
                  [{trainingData.targets[idx].map(v => v.toFixed(2)).join(', ')}]
                </div>
              </div>
            ))}
            {trainingData.inputs.length > 8 && (
              <div className="preview-more">
                ... and {trainingData.inputs.length - 8} more samples
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
