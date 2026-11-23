# Quick Start Guide 🚀

Get up and running with the Neural Network Playground in 5 minutes!

## Installation

```bash
# Navigate to the project directory
cd neural-network-playground

# Install dependencies
npm install

# Start the development server
npm run dev
```

The playground will open automatically at `http://localhost:3000`

## First Steps

### 1. Start with XOR Problem (2 minutes)

The playground loads with a simple XOR problem by default - a classic neural network test.

**What to do:**
1. Click the **"Start Training"** button in the left sidebar
2. Watch the 3D network come alive:
   - Nodes light up with activation values
   - Cyan particles flow through connections
   - Loss decreases in real-time

**What you're seeing:**
- The network is learning the XOR function (true when inputs differ)
- Orange/red nodes = positive activations
- Blue nodes = negative activations
- Lines show connection weights (green = positive, red = negative)

### 2. Explore the 3D View (1 minute)

**Mouse Controls:**
- **Left Click + Drag** → Rotate the view
- **Right Click + Drag** → Pan the camera
- **Scroll Wheel** → Zoom in/out
- **Click a Node** → Select and inspect it

**Try this:**
- Rotate to see the network from different angles
- Zoom in to watch individual neurons activate
- Click on nodes to see their exact values

### 3. Change the Architecture (2 minutes)

**Switch to the "Architecture" tab:**

1. **Add a Hidden Layer:**
   - Click the **+** button next to any layer
   - Watch the 3D network restructure itself!

2. **Change Node Counts:**
   - Click the **edit icon** (pencil) on any layer
   - Type a new number (try 8 nodes)
   - Press Enter
   - See the network adapt in 3D

3. **Choose an Activation Function:**
   - Try different functions in the dropdown
   - Each affects how neurons process information

### 4. Try Different Datasets (1 minute)

**Switch to the "Dataset" tab:**

1. **Circle Classification:**
   - Click on the "Circle Classification" card
   - Train the network to separate points inside/outside a circle
   - Watch how it learns curved boundaries

2. **Spiral Pattern:**
   - Most challenging dataset
   - Network must learn complex, intertwined patterns
   - Try adding more layers if it struggles!

## Tips for Exploration

### Understanding the Visualization

- **Node Colors:**
  - Brighter = stronger activation
  - Orange/Red = positive values
  - Blue = negative values

- **Connection Lines:**
  - Thickness = weight strength
  - Green = positive weight (excitatory)
  - Red = negative weight (inhibitory)

- **Flowing Particles:**
  - Show information propagating forward
  - Speed controlled by animation settings

### Training Tips

1. **Learning Rate:**
   - Too high → Network oscillates or diverges
   - Too low → Very slow learning
   - Sweet spot: 0.1 - 0.3 for most problems

2. **Architecture:**
   - XOR needs at least 1 hidden layer (minimum 2 nodes)
   - Circle needs 2-3 hidden layers
   - Spiral needs 3-4 layers with more nodes

3. **Training Speed:**
   - Slow down to watch individual steps
   - Speed up for faster convergence
   - Use "Train 100 Epochs" for instant progress

### Advanced Features

**Visualization Controls Tab:**
- Toggle weight lines on/off
- Show/hide activation particles
- Display gradient flow (backpropagation)
- Adjust animation speed

**Metrics Tab:**
- Real-time loss curve
- Training statistics
- Network information

**Export/Import:**
- Save trained networks to JSON
- Share configurations with others
- Resume training later

## Common Questions

**Q: Why isn't the network learning?**
- Try resetting and training longer
- Increase learning rate
- Add more hidden layers/nodes
- Check if dataset is loaded

**Q: What's the minimum architecture for XOR?**
- Input: 2 nodes (the two inputs)
- Hidden: 2 nodes minimum (try 3-4 for faster learning)
- Output: 1 node (the XOR result)

**Q: How do I know training is working?**
- Loss should decrease over time
- Node activations should become more distinct
- Output should approach target values

**Q: Can I create custom datasets?**
- Yes! Edit `src/store/networkStore.js`
- Add your own input/target pairs
- Follow the existing format

## Next Steps

1. **Experiment with Architectures:**
   - What's the smallest network that can learn each dataset?
   - What happens with too many layers?
   - Try extreme learning rates

2. **Study Activation Functions:**
   - Switch between Sigmoid, ReLU, Tanh
   - See how each affects learning
   - Which works best for each dataset?

3. **Watch Gradients:**
   - Enable gradient visualization
   - See backpropagation in action
   - Understand how errors flow backward

4. **Build Your Own:**
   - Customize the visualizations
   - Add new datasets
   - Extend the neural network engine

## Resources

- **README.md** - Full documentation
- **src/engine/NeuralNetwork.js** - Core implementation
- **GitHub Issues** - Report bugs or request features

## Troubleshooting

**Server won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Visual glitches:**
- Refresh the browser
- Check if WebGL is supported
- Try a different browser (Chrome/Firefox recommended)

**Performance issues:**
- Reduce animation speed
- Disable activation particles
- Use smaller networks

---

**Have fun exploring neural networks! 🎉**

The best way to learn is to experiment. Try breaking things, testing limits, and seeing what happens!
