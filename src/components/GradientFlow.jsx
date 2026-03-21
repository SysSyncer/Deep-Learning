import React, { useState } from 'react';
import './GradientFlow.css';

export default function GradientFlow({ weights, dataset, learningRate }) {
  const [showDetails, setShowDetails] = useState(false);

  // Simulate a single backprop step for visualization
  const simulateBackprop = () => {
    if (!weights || !dataset || dataset.length === 0) return null;

    const sample = dataset[0]; // Use first sample for demo
    // This is just for visualization - actual calculation happens in PerceptronSimulator
    
    return {
      input: sample.x,
      target: sample.y,
      steps: [
        {
          name: 'Forward Pass',
          description: 'Calculate activations layer by layer',
          color: '#3498db'
        },
        {
          name: 'Calculate Error',
          description: 'Compare prediction with target',
          color: '#e74c3c'
        },
        {
          name: 'Backward Pass',
          description: 'Propagate error backwards',
          color: '#f39c12'
        },
        {
          name: 'Update Weights',
          description: 'Adjust weights using gradients',
          color: '#27ae60'
        }
      ]
    };
  };

  const backpropData = simulateBackprop();

  return (
    <div className="gradient-flow-container">
      <div className="gradient-header">
        <h5>🔄 Gradient Flow Visualization</h5>
        <button 
          className="toggle-details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▼ Hide Details' : '▶ Show Details'}
        </button>
      </div>

      {backpropData && (
        <div className="flow-steps">
          {backpropData.steps.map((step, index) => (
            <div key={index} className="flow-step">
              <div 
                className="step-indicator" 
                style={{ backgroundColor: step.color }}
              >
                {index + 1}
              </div>
              <div className="step-info">
                <h6 style={{ color: step.color }}>{step.name}</h6>
                <p>{step.description}</p>
              </div>
              {index < backpropData.steps.length - 1 && (
                <div className="step-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      )}

      {showDetails && (
        <div className="gradient-details">
          <div className="detail-section">
            <h6>📊 Network Architecture</h6>
            <div className="architecture-info">
              <div className="layer-info">
                <span className="layer-label">Input Layer:</span>
                <span className="layer-value">2 neurons</span>
              </div>
              <div className="layer-info">
                <span className="layer-label">Hidden Layer:</span>
                <span className="layer-value">4 neurons (sigmoid)</span>
              </div>
              <div className="layer-info">
                <span className="layer-label">Output Layer:</span>
                <span className="layer-value">1 neuron (sigmoid)</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h6>⚙️ Training Parameters</h6>
            <div className="params-info">
              <div className="param-item">
                <span className="param-label">Learning Rate:</span>
                <code>{learningRate || 0.3}</code>
              </div>
              <div className="param-item">
                <span className="param-label">Algorithm:</span>
                <code>Stochastic Gradient Descent (SGD)</code>
              </div>
              <div className="param-item">
                <span className="param-label">Loss Function:</span>
                <code>Mean Squared Error (MSE)</code>
              </div>
              <div className="param-item">
                <span className="param-label">Activation:</span>
                <code>Sigmoid (σ)</code>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h6>🧮 Gradient Calculation Chain</h6>
            <div className="chain-steps">
              <div className="chain-item">
                <code>∂L/∂W₂ = ∂L/∂y · ∂y/∂z₂ · ∂z₂/∂W₂</code>
                <small>Output layer gradients</small>
              </div>
              <div className="chain-item">
                <code>∂L/∂W₁ = ∂L/∂y · ∂y/∂z₂ · ∂z₂/∂h · ∂h/∂z₁ · ∂z₁/∂W₁</code>
                <small>Hidden layer gradients (chain rule)</small>
              </div>
              <div className="chain-item">
                <code>W_new = W_old - η · ∂L/∂W</code>
                <small>Weight update formula</small>
              </div>
            </div>
          </div>

          <div className="detail-section key-concepts">
            <h6>💡 Key Concepts</h6>
            <ul>
              <li>
                <strong>Chain Rule:</strong> Decomposes complex derivatives into simpler parts
              </li>
              <li>
                <strong>Gradient:</strong> Direction and magnitude of steepest increase
              </li>
              <li>
                <strong>Learning Rate:</strong> Controls step size in weight updates
              </li>
              <li>
                <strong>Sigmoid Derivative:</strong> σ'(x) = σ(x) · (1 - σ(x))
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
