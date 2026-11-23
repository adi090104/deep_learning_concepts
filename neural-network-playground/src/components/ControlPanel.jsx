import React from 'react';
import { useNetworkStore } from '../store/networkStore';
import { Play, Pause, RotateCcw, Download, Upload } from 'lucide-react';
import '../styles/ControlPanel.css';

export default function ControlPanel() {
  const {
    network,
    isTraining,
    trainingSpeed,
    currentEpoch,
    startTraining,
    stopTraining,
    setTrainingSpeed,
    setLearningRate,
    resetNetwork,
    trainBatch,
    exportNetwork,
    importNetwork
  } = useNetworkStore();
  
  const handleExport = () => {
    const json = exportNetwork();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neural-network.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          importNetwork(json);
        } catch (error) {
          console.error('Failed to import network:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>Training Controls</h3>
        
        <div className="control-group">
          <div className="button-group">
            {!isTraining ? (
              <button className="btn btn-primary" onClick={startTraining}>
                <Play size={16} />
                Start Training
              </button>
            ) : (
              <button className="btn btn-danger" onClick={stopTraining}>
                <Pause size={16} />
                Stop Training
              </button>
            )}
            
            <button className="btn btn-secondary" onClick={() => trainBatch(100)}>
              Train 100 Epochs
            </button>
            
            <button className="btn btn-secondary" onClick={resetNetwork}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <label>
            Learning Rate: {network.learningRate.toFixed(3)}
            <input
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={network.learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="slider"
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            Training Speed: {trainingSpeed}ms
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={trainingSpeed}
              onChange={(e) => setTrainingSpeed(parseInt(e.target.value))}
              className="slider"
            />
          </label>
        </div>
        
        <div className="metrics">
          <div className="metric">
            <span className="metric-label">Epoch:</span>
            <span className="metric-value">{currentEpoch}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Loss:</span>
            <span className="metric-value">
              {network.history.loss.length > 0 
                ? network.history.loss[network.history.loss.length - 1].toFixed(4)
                : '0.0000'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Network I/O</h3>
        
        <div className="button-group">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} />
            Export
          </button>
          
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
