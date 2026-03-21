# Neural Network Playground
**https://neural-network-workspace-dl.vercel.app/**
[![Build and Push Docker Image](https://github.com/sivasks2004/NeuralNetworkPlayground-DL/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/sivasks2004/NeuralNetworkPlayground-DL/actions/workflows/docker-publish.yml)
[![Docker Image](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/sivasks2004/NeuralNetworkPlayground-DL/pkgs/container/neuralnetworkplayground-dl)

An interactive web application for visualizing and training neural networks. Built with React, this playground allows you to experiment with different network configurations, activation functions, and training parameters in real-time.

## 🌟 Features

- **Pre-trained Sample Weights** ✨ - Start with a working solution to understand trained networks
- **Interactive Neural Network Visualization** - See your network's structure and activations in real-time
- **Manual Weight Editing** - Fine-tune weights and biases manually
- **Multiple Activation Functions** - Train with Sigmoid, ReLU, Tanh, Leaky ReLU, Step, and Linear ⚡
- **Full Backpropagation Support** - All activation functions work with training, not just visualization!
- **Live Training Animation** - Watch the network learn step-by-step
- **Backpropagation Visualization** 🧠 - See the 4-step learning process in action
- **Gradient Flow Display** - Understand how gradients propagate backwards
- **Adjustable Hyperparameters** - Control learning rate and epochs
- **Loss Tracking** - Monitor training progress with MSE loss
- **Three Weight Modes** - Sample (pre-trained), Random, or Empty weights

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Using Docker Compose
docker-compose up -d

# Or using Docker CLI
docker pull ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest
docker run -d -p 8080:80 ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest
```

Visit **http://localhost:8080**

📚 See [README.Docker.md](./README.Docker.md) for detailed Docker documentation.

## 🎓 Quick Start Guide

### First Time Users - Start Here!

1. **Explore the Pre-trained Network** ✨
   - The app loads with **sample pre-trained weights** solving the AND gate
   - Try all 4 input combinations: [0,0], [0,1], [1,0], [1,1]
   - See how a trained network produces correct outputs
   - Notice the very low loss value (~0.0001)

2. **Understand Backpropagation** 🧠
   - Scroll down to see the "Backpropagation Process" visualization
   - Learn the 4 steps: Forward → Error → Backward → Update
   - Click "Show Details" in Gradient Flow for deep dive

3. **Train from Scratch** 🎲
   - Click "Load Random Weights" button
   - See the high initial loss
   - **Select any activation function** (Sigmoid, ReLU, Tanh, etc.)
   - Click "Train" and watch the network learn!
   - Observe loss decreasing and predictions improving

4. **Experiment Manually** ⚙️
   - Click "Clear All Weights"
   - Fill in weights manually
   - **Try different activation functions** to see how they behave
   - See immediate effects on predictions
   - Learn how each weight affects the output

5. **Compare Activation Functions** 🔬
   - Load sample weights and switch between activations
   - Train from random weights with ReLU vs Sigmoid
   - Observe different convergence speeds and patterns
   - Learn which activations work best for different problems

### Local Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## 🧮 Activation Functions

All activation functions are **fully supported for training**, not just visualization!

### Available Activations

| Function | Formula | Best For | Training Support |
|----------|---------|----------|------------------|
| **Sigmoid** | σ(x) = 1/(1+e^(-x)) | Binary classification, smooth gradients | ✅ Full |
| **Tanh** | tanh(x) = (e^x - e^(-x))/(e^x + e^(-x)) | Zero-centered outputs, faster convergence | ✅ Full |
| **ReLU** | ReLU(x) = max(0, x) | Deep networks, computational efficiency | ✅ Full |
| **Leaky ReLU** | x if x>0, else 0.01x | Preventing dying ReLU | ✅ Full |
| **Step** | 1 if x≥0, else 0 | Understanding perceptrons | ✅ Full (slow) |
| **Linear** | f(x) = x | Regression, output layers | ✅ Full |

### Training Tips by Activation

- **Sigmoid/Tanh**: Default learning rate (0.3) works well
- **ReLU**: Try lower learning rate (0.1-0.2) to prevent dying neurons
- **Leaky ReLU**: Similar to ReLU, good gradient flow
- **Step**: Very slow convergence due to near-zero gradients
- **Linear**: May not converge for non-linear problems (AND, XOR)

📖 See [MULTI_ACTIVATION_SUPPORT.md](./MULTI_ACTIVATION_SUPPORT.md) for detailed technical information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 🐳 Docker Deployment

This application is fully containerized and automatically published to GitHub Container Registry.

### Quick Deploy with Docker

```bash
# Pull and run the latest image
docker pull ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest
docker run -d -p 8080:80 ghcr.io/sivasks2004/neuralnetworkplayground-dl:latest
```

### Available Tags

- `latest` - Latest stable build
- `main` - Latest from main branch
- `v*` - Semantic versions (e.g., v1.0.0)

For complete Docker documentation, see [README.Docker.md](./README.Docker.md)

## 📦 GitHub Packages

Docker images are automatically built and published to GitHub Container Registry on every push to main:

- **Registry**: `ghcr.io`
- **Image**: `ghcr.io/sivasks2004/neuralnetworkplayground-dl`

## 🛠️ Tech Stack

- **Frontend**: React 19
- **UI Framework**: Bootstrap 5
- **Visualization**: Custom Canvas API
- **Charts**: Recharts
- **Build Tool**: Create React App
- **Container**: Docker + Nginx Alpine

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
