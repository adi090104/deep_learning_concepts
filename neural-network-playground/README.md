# Neural Network Playground 🧠

An interactive 3D visualization tool for understanding how neural networks work. Built entirely from scratch without high-level ML libraries - every forward pass, backward pass, and gradient calculation is implemented manually.

![Neural Network Playground](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r160-000000?style=flat&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)

## ✨ Features

### 🏗️ Dynamic Architecture
- **Add/Remove Layers**: Build custom network architectures by adding or removing hidden layers
- **Adjust Node Counts**: Change the number of neurons in each layer dynamically
- **Real-time Adaptation**: Watch the network restructure itself in 3D space

### 🎨 Interactive 3D Visualization
- **Real-time Activation Flow**: See signals propagate through the network as animated particles
- **Weight Visualization**: Connection lines show weight strengths (green = positive, red = negative)
- **Gradient Display**: Visualize backpropagation gradients during training
- **Interactive Nodes**: Click on neurons to select and inspect them

### 📊 Training & Datasets
- **Multiple Datasets**: 
  - XOR Problem - Classic non-linearly separable problem
  - Circle Classification - Radial decision boundaries
  - Spiral Pattern - Complex non-linear patterns
- **Live Training**: Watch the network learn in real-time
- **Adjustable Learning Rate**: Fine-tune training speed
- **Loss Visualization**: Real-time loss curve plotting

### 🎛️ Full Control
- **Activation Functions**: Switch between Sigmoid, Tanh, ReLU, Leaky ReLU, and Linear
- **Training Speed**: Adjust how fast the network trains
- **Export/Import**: Save and load trained networks
- **Reset**: Reinitialize weights at any time

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd neural-network-playground
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Basic Workflow

1. **Choose a Dataset**
   - Go to the "Dataset" tab
   - Select from XOR, Circle, or Spiral patterns
   - Preview the training data

2. **Configure Architecture**
   - Open the "Architecture" tab
   - Add/remove layers using the + and - buttons
   - Edit node counts by clicking the edit icon
   - Choose an activation function

3. **Adjust Training Parameters**
   - Switch to the "Training" tab
   - Set your desired learning rate
   - Adjust training speed for visualization

4. **Start Training**
   - Click "Start Training" to begin
   - Watch activations flow through the network in 3D
   - Monitor the loss curve in the "Metrics" tab

5. **Visualize**
   - Use the "Visualization" tab to toggle:
     - Weight connections
     - Activation particles
     - Gradient displays
   - Rotate, pan, and zoom the 3D view with your mouse

### Camera Controls

- **🖱️ Left Click + Drag**: Rotate the view
- **🖱️ Right Click + Drag**: Pan the camera
- **🖱️ Scroll Wheel**: Zoom in/out
- **🖱️ Click Node**: Select and inspect a neuron

### Understanding the Colors

- **Orange/Red Nodes**: Positive activations (higher values = brighter)
- **Blue Nodes**: Negative activations (higher magnitude = brighter)
- **Green Lines**: Positive weights (thicker = stronger)
- **Red Lines**: Negative weights (thicker = stronger)
- **Cyan Particles**: Activation signals flowing through the network

## 🏗️ Architecture

### Project Structure

```
neural-network-playground/
├── src/
│   ├── components/           # React components
│   │   ├── NetworkVisualization3D.jsx   # Main 3D scene
│   │   ├── ControlPanel.jsx             # Training controls
│   │   ├── ArchitectureEditor.jsx       # Layer/node editing
│   │   ├── DatasetSelector.jsx          # Dataset selection
│   │   ├── VisualizationControls.jsx    # View toggles
│   │   └── MetricsDisplay.jsx           # Training metrics
│   ├── engine/               # Neural network engine (from scratch!)
│   │   └── NeuralNetwork.js             # Core ML implementation
│   ├── store/                # State management
│   │   └── networkStore.js              # Zustand store
│   ├── styles/               # CSS modules
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── index.html
├── vite.config.js
└── package.json
```

### Core Neural Network Engine

The neural network is implemented from scratch in `src/engine/NeuralNetwork.js`:

- **Matrix Operations**: Custom matrix multiplication, addition, and transformations
- **Forward Propagation**: Manual computation of weighted sums and activations
- **Backpropagation**: Gradient calculation using the chain rule
- **Gradient Descent**: Weight and bias updates based on gradients
- **Activation Functions**: Sigmoid, Tanh, ReLU, Leaky ReLU, Linear

### Technologies Used

- **React 18**: UI framework
- **Three.js**: 3D rendering
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for Three.js
- **Zustand**: Lightweight state management
- **Framer Motion**: Smooth animations
- **Vite**: Fast build tool and dev server

## 🧪 Educational Purpose

This playground is designed to help you understand:

1. **Neural Network Fundamentals**
   - How neurons process information
   - How weights control information flow
   - How biases shift activations

2. **Backpropagation**
   - How gradients are calculated
   - How errors propagate backwards
   - How the chain rule applies in deep networks

3. **Training Dynamics**
   - Effect of learning rate on convergence
   - How architecture affects learning capability
   - Why some problems need more layers

4. **Activation Functions**
   - Different activation behaviors
   - When to use which activation
   - Impact on gradient flow

## 🎯 Example Use Cases

### Teaching ML Concepts
Use this tool in classrooms or workshops to demonstrate:
- How neural networks learn XOR (a classic problem)
- The importance of hidden layers for non-linear problems
- How gradient descent optimizes weights

### Experimentation
Try different configurations:
- Can a 2-4-1 network learn XOR?
- What's the minimum architecture for the spiral pattern?
- How does learning rate affect convergence speed?

### Research & Prototyping
- Visualize custom architectures before implementing them
- Test different activation function combinations
- Understand gradient flow in deep networks

## 🔧 Customization

### Adding New Datasets

Edit `src/store/networkStore.js` to add new training data:

```javascript
case 'custom':
  return {
    inputs: [[x1, y1], [x2, y2], ...],
    targets: [[t1], [t2], ...]
  };
```

### Adding New Activation Functions

Extend `src/engine/NeuralNetwork.js`:

```javascript
export const ActivationFunctions = {
  myActivation: {
    func: (x) => /* your function */,
    derivative: (y) => /* derivative */
  }
};
```

### Customizing Visualizations

Modify `src/components/NetworkVisualization3D.jsx`:
- Change node colors, sizes, or animations
- Add new particle effects
- Customize connection rendering

## 📝 Technical Details

### Forward Pass Algorithm

```
For each layer:
  1. Multiply inputs by weights: z = W × x
  2. Add biases: z = z + b
  3. Apply activation: a = σ(z)
  4. Use output as input for next layer
```

### Backpropagation Algorithm

```
1. Calculate output error: δ = (target - output)
2. For each layer (backwards):
   a. Calculate gradient: ∇ = δ × σ'(output)
   b. Update weights: W += η × ∇ × input^T
   c. Update biases: b += η × ∇
   d. Propagate error: δ = W^T × δ
```

### Performance Optimizations

- Matrix operations optimized for JavaScript
- Animation frame throttling
- Efficient Three.js scene updates
- Zustand for minimal re-renders

## 🤝 Contributing

Contributions are welcome! Some ideas:

- Add more datasets (MNIST visualization, etc.)
- Implement batch normalization
- Add dropout visualization
- Support for CNNs or RNNs
- Performance improvements

## 📄 License

MIT License - feel free to use this for educational purposes!

## 🙏 Acknowledgments

Built with ❤️ to make machine learning more accessible and understandable through interactive visualization.

## 📬 Support

If you find this helpful for learning or teaching, please star ⭐ the repository!

For questions or suggestions, please open an issue on GitHub.

---

**Happy Learning! 🚀**
