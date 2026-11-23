import { create } from 'zustand';
import { NeuralNetwork } from '../engine/NeuralNetwork';

// Generate sample training data
const generateTrainingData = (type = 'xor') => {
  switch (type) {
    case 'xor':
      return {
        inputs: [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1]
        ],
        targets: [
          [0],
          [1],
          [1],
          [0]
        ]
      };
    case 'circle':
      const circleData = { inputs: [], targets: [] };
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const distance = Math.sqrt(x * x + y * y);
        circleData.inputs.push([x, y]);
        circleData.targets.push([distance < 0.6 ? 1 : 0]);
      }
      return circleData;
    case 'spiral':
      const spiralData = { inputs: [], targets: [] };
      for (let i = 0; i < 100; i++) {
        const theta = Math.random() * 4 * Math.PI;
        const r = theta / (4 * Math.PI);
        const x = r * Math.cos(theta) * (Math.random() > 0.5 ? 1 : -1);
        const y = r * Math.sin(theta) * (Math.random() > 0.5 ? 1 : -1);
        spiralData.inputs.push([x, y]);
        spiralData.targets.push([Math.random() > 0.5 ? 1 : 0]);
      }
      return spiralData;
    default:
      return generateTrainingData('xor');
  }
};

export const useNetworkStore = create((set, get) => ({
  // Network instance
  network: new NeuralNetwork([2, 4, 3, 1]),
  
  // Training data
  trainingData: generateTrainingData('xor'),
  datasetType: 'xor',
  
  // Training state
  isTraining: false,
  trainingSpeed: 100, // ms between training steps
  currentEpoch: 0,
  
  // Visualization state
  showWeights: true,
  showActivations: true,
  showGradients: false,
  animationSpeed: 1,
  
  // Network architecture state
  selectedLayer: null,
  selectedNode: null,
  
  // Actions
  createNetwork: (architecture) => {
    set({ network: new NeuralNetwork(architecture), currentEpoch: 0 });
  },
  
  addLayer: (position, nodes) => {
    const { network } = get();
    network.addLayer(position, nodes);
    set({ network: network.copy(), currentEpoch: 0 });
  },
  
  removeLayer: (position) => {
    const { network } = get();
    network.removeLayer(position);
    set({ network: network.copy(), currentEpoch: 0 });
  },
  
  changeLayerNodes: (layerIndex, nodes) => {
    const { network } = get();
    network.changeLayerNodes(layerIndex, nodes);
    set({ network: network.copy(), currentEpoch: 0 });
  },
  
  setLearningRate: (rate) => {
    const { network } = get();
    network.setLearningRate(rate);
    set({ network });
  },
  
  setActivationFunction: (activationName) => {
    const { network } = get();
    network.setActivation(activationName);
    set({ network: network.copy() });
  },
  
  changeDataset: (type) => {
    const trainingData = generateTrainingData(type);
    set({ trainingData, datasetType: type, currentEpoch: 0 });
  },
  
  trainStep: () => {
    const { network, trainingData } = get();
    const { inputs, targets } = trainingData;
    
    // Train on one random sample
    const index = Math.floor(Math.random() * inputs.length);
    network.train(inputs[index], targets[index]);
    
    set({ 
      network: network.copy(),
      currentEpoch: get().currentEpoch + 1
    });
  },
  
  trainBatch: (epochs = 1) => {
    const { network, trainingData } = get();
    const { inputs, targets } = trainingData;
    
    network.trainBatch(inputs, targets, epochs);
    
    set({ 
      network: network.copy(),
      currentEpoch: get().currentEpoch + epochs * inputs.length
    });
  },
  
  startTraining: () => {
    set({ isTraining: true });
    
    const train = () => {
      const { isTraining, trainingSpeed } = get();
      if (!isTraining) return;
      
      get().trainStep();
      
      setTimeout(train, trainingSpeed);
    };
    
    train();
  },
  
  stopTraining: () => {
    set({ isTraining: false });
  },
  
  setTrainingSpeed: (speed) => {
    set({ trainingSpeed: speed });
  },
  
  resetNetwork: () => {
    const { network } = get();
    network.initializeWeights();
    set({ network: network.copy(), currentEpoch: 0 });
  },
  
  predictInput: (input) => {
    const { network } = get();
    return network.predict(input);
  },
  
  // Visualization toggles
  toggleWeights: () => set({ showWeights: !get().showWeights }),
  toggleActivations: () => set({ showActivations: !get().showActivations }),
  toggleGradients: () => set({ showGradients: !get().showGradients }),
  
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  
  // Selection
  selectLayer: (layerIndex) => set({ selectedLayer: layerIndex }),
  selectNode: (layerIndex, nodeIndex) => set({ selectedLayer: layerIndex, selectedNode: nodeIndex }),
  clearSelection: () => set({ selectedLayer: null, selectedNode: null }),
  
  // Export/Import
  exportNetwork: () => {
    const { network } = get();
    return network.toJSON();
  },
  
  importNetwork: (json) => {
    const network = NeuralNetwork.fromJSON(json);
    set({ network, currentEpoch: 0 });
  }
}));
