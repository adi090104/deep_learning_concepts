/**
 * Neural Network Engine - Built from scratch
 * Implements forward propagation, backpropagation, and gradient descent
 */

export class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(rows).fill().map(() => Array(cols).fill(0));
  }

  static fromArray(arr) {
    const m = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) {
      m.data[i][0] = arr[i];
    }
    return m;
  }

  toArray() {
    const arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1; // Range: -1 to 1
      }
    }
    return this;
  }

  static multiply(a, b) {
    if (a.cols !== b.rows) {
      console.error('Columns of A must match rows of B.');
      return undefined;
    }
    const result = new Matrix(a.rows, b.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  }

  multiply(n) {
    if (n instanceof Matrix) {
      // Hadamard product
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n.data[i][j];
        }
      }
    } else {
      // Scalar product
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    }
    return this;
  }

  add(n) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += n;
        }
      }
    }
    return this;
  }

  static subtract(a, b) {
    const result = new Matrix(a.rows, a.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        result.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return result;
  }

  static transpose(matrix) {
    const result = new Matrix(matrix.cols, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.data[j][i] = matrix.data[i][j];
      }
    }
    return result;
  }

  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    const result = new Matrix(matrix.rows, matrix.cols);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        const val = matrix.data[i][j];
        result.data[i][j] = func(val, i, j);
      }
    }
    return result;
  }

  copy() {
    const m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }
}

// Activation functions
export const ActivationFunctions = {
  sigmoid: {
    func: (x) => 1 / (1 + Math.exp(-x)),
    derivative: (y) => y * (1 - y)
  },
  tanh: {
    func: (x) => Math.tanh(x),
    derivative: (y) => 1 - (y * y)
  },
  relu: {
    func: (x) => Math.max(0, x),
    derivative: (y) => y > 0 ? 1 : 0
  },
  leakyRelu: {
    func: (x) => x > 0 ? x : 0.01 * x,
    derivative: (y) => y > 0 ? 1 : 0.01
  },
  linear: {
    func: (x) => x,
    derivative: (y) => 1
  }
};

export class NeuralNetwork {
  constructor(architecture = [2, 4, 1]) {
    this.architecture = architecture;
    this.weights = [];
    this.biases = [];
    this.learningRate = 0.1;
    this.activationFunction = ActivationFunctions.sigmoid;
    
    // Initialize weights and biases for each layer
    this.initializeWeights();
    
    // Training history
    this.history = {
      loss: [],
      accuracy: []
    };
    
    // For visualization
    this.layerOutputs = [];
    this.layerInputs = [];
    this.gradients = [];
  }

  initializeWeights() {
    this.weights = [];
    this.biases = [];
    
    for (let i = 0; i < this.architecture.length - 1; i++) {
      const inputNodes = this.architecture[i];
      const outputNodes = this.architecture[i + 1];
      
      // Xavier/Glorot initialization
      const scale = Math.sqrt(2.0 / (inputNodes + outputNodes));
      const weights = new Matrix(outputNodes, inputNodes);
      weights.map(() => (Math.random() * 2 - 1) * scale);
      
      const biases = new Matrix(outputNodes, 1);
      biases.map(() => (Math.random() * 2 - 1) * scale);
      
      this.weights.push(weights);
      this.biases.push(biases);
    }
  }

  setActivation(activationName) {
    if (ActivationFunctions[activationName]) {
      this.activationFunction = ActivationFunctions[activationName];
    }
  }

  setLearningRate(rate) {
    this.learningRate = rate;
  }

  // Forward propagation
  feedforward(inputArray) {
    this.layerOutputs = [];
    this.layerInputs = [];
    
    let current = Matrix.fromArray(inputArray);
    this.layerOutputs.push(current.copy());
    
    for (let i = 0; i < this.weights.length; i++) {
      // Calculate weighted sum + bias
      current = Matrix.multiply(this.weights[i], current);
      current.add(this.biases[i]);
      
      this.layerInputs.push(current.copy());
      
      // Apply activation function
      current.map(this.activationFunction.func);
      
      this.layerOutputs.push(current.copy());
    }
    
    return current.toArray();
  }

  // Backpropagation
  train(inputArray, targetArray) {
    // Forward pass
    const outputs = this.feedforward(inputArray);
    
    // Convert targets to matrix
    const targets = Matrix.fromArray(targetArray);
    
    // Calculate output error
    const outputErrors = Matrix.subtract(targets, this.layerOutputs[this.layerOutputs.length - 1]);
    
    // Store gradients for visualization
    this.gradients = [];
    
    // Backpropagate errors
    let errors = outputErrors;
    
    for (let i = this.weights.length - 1; i >= 0; i--) {
      // Calculate gradient
      const gradients = Matrix.map(this.layerOutputs[i + 1], this.activationFunction.derivative);
      gradients.multiply(errors);
      gradients.multiply(this.learningRate);
      
      this.gradients.unshift(gradients.copy());
      
      // Calculate deltas
      const layerOutputT = Matrix.transpose(this.layerOutputs[i]);
      const weightDeltas = Matrix.multiply(gradients, layerOutputT);
      
      // Adjust weights and biases
      this.weights[i].add(weightDeltas);
      this.biases[i].add(gradients);
      
      // Calculate errors for previous layer
      const weightsT = Matrix.transpose(this.weights[i]);
      errors = Matrix.multiply(weightsT, errors);
    }
    
    return outputs;
  }

  // Train on a batch of data
  trainBatch(inputs, targets, epochs = 1) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      
      for (let i = 0; i < inputs.length; i++) {
        const output = this.train(inputs[i], targets[i]);
        
        // Calculate loss (MSE)
        const loss = targets[i].reduce((sum, target, j) => {
          return sum + Math.pow(target - output[j], 2);
        }, 0) / targets[i].length;
        
        totalLoss += loss;
      }
      
      const avgLoss = totalLoss / inputs.length;
      this.history.loss.push(avgLoss);
    }
  }

  predict(inputArray) {
    return this.feedforward(inputArray);
  }

  // Add a new layer
  addLayer(position, nodes) {
    this.architecture.splice(position, 0, nodes);
    this.initializeWeights();
  }

  // Remove a layer
  removeLayer(position) {
    if (this.architecture.length > 2 && position > 0 && position < this.architecture.length - 1) {
      this.architecture.splice(position, 1);
      this.initializeWeights();
    }
  }

  // Change nodes in a layer
  changeLayerNodes(layerIndex, nodes) {
    if (nodes > 0) {
      this.architecture[layerIndex] = nodes;
      this.initializeWeights();
    }
  }

  // Get network state for visualization
  getNetworkState() {
    return {
      architecture: this.architecture,
      weights: this.weights.map(w => ({
        rows: w.rows,
        cols: w.cols,
        data: w.data.map(row => [...row])
      })),
      biases: this.biases.map(b => ({
        rows: b.rows,
        cols: b.cols,
        data: b.data.map(row => [...row])
      })),
      layerOutputs: this.layerOutputs.map(l => l.toArray()),
      gradients: this.gradients.map(g => ({
        rows: g.rows,
        cols: g.cols,
        data: g.data.map(row => [...row])
      })),
      learningRate: this.learningRate,
      history: {
        loss: [...this.history.loss],
        accuracy: [...this.history.accuracy]
      }
    };
  }

  // Clone the network
  copy() {
    const copy = new NeuralNetwork(this.architecture);
    copy.weights = this.weights.map(w => w.copy());
    copy.biases = this.biases.map(b => b.copy());
    copy.learningRate = this.learningRate;
    copy.activationFunction = this.activationFunction;
    return copy;
  }

  // Serialize to JSON
  toJSON() {
    return {
      architecture: this.architecture,
      weights: this.weights.map(w => w.data),
      biases: this.biases.map(b => b.data),
      learningRate: this.learningRate
    };
  }

  // Load from JSON
  static fromJSON(json) {
    const nn = new NeuralNetwork(json.architecture);
    
    nn.weights = json.weights.map(w => {
      const matrix = new Matrix(w.length, w[0].length);
      matrix.data = w;
      return matrix;
    });
    
    nn.biases = json.biases.map(b => {
      const matrix = new Matrix(b.length, b[0].length);
      matrix.data = b;
      return matrix;
    });
    
    nn.learningRate = json.learningRate;
    
    return nn;
  }
}
