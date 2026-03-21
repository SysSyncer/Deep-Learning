import React from 'react';
import './BackpropVisualization.css';

export default function BackpropVisualization({ 
  isTraining, 
  epoch, 
  loss, 
  showExplanation = true 
}) {
  return (
    <div className="backprop-container">
      <h5 className="backprop-title">
        🧠 Backpropagation Process
      </h5>
      
      {showExplanation && (
        <div className="backprop-explanation">
          <div className="algo-step">
            <span className="step-number">1️⃣</span>
            <div className="step-content">
              <strong>Forward Pass</strong>
              <p>Input → Hidden Layer → Output Layer</p>
              <code>y_pred = σ(W₂ · σ(W₁ · x + b₁) + b₂)</code>
            </div>
          </div>

          <div className="algo-step">
            <span className="step-number">2️⃣</span>
            <div className="step-content">
              <strong>Calculate Error</strong>
              <p>Compare prediction with actual value</p>
              <code>Error = (y_pred - y_actual)²</code>
            </div>
          </div>

          <div className="algo-step">
            <span className="step-number">3️⃣</span>
            <div className="step-content">
              <strong>Backward Pass</strong>
              <p>Calculate gradients using chain rule</p>
              <code>δ_out = error · σ'(output)</code>
              <code>δ_hidden = δ_out · W₂ · σ'(hidden)</code>
            </div>
          </div>

          <div className="algo-step">
            <span className="step-number">4️⃣</span>
            <div className="step-content">
              <strong>Update Weights</strong>
              <p>Gradient descent optimization</p>
              <code>W = W - learning_rate · gradient</code>
            </div>
          </div>
        </div>
      )}

      <div className="backprop-status">
        <div className="status-item">
          <span className="status-label">Training Status:</span>
          <span className={`status-value ${isTraining ? 'training' : 'idle'}`}>
            {isTraining ? '🔄 Training...' : '⏸️ Idle'}
          </span>
        </div>
        
        <div className="status-item">
          <span className="status-label">Current Epoch:</span>
          <span className="status-value">{epoch}</span>
        </div>
        
        <div className="status-item">
          <span className="status-label">Loss (MSE):</span>
          <span className={`status-value ${loss !== null && loss < 0.1 ? 'good-loss' : 'normal-loss'}`}>
            {loss !== null ? loss.toFixed(4) : 'N/A'}
          </span>
        </div>
      </div>

      {isTraining && (
        <div className="gradient-flow-animation">
          <div className="flow-arrow forward">→</div>
          <div className="flow-text">Forward Pass</div>
          <div className="flow-arrow backward">←</div>
          <div className="flow-text">Backward Pass</div>
        </div>
      )}

      <div className="backprop-formula">
        <h6>📐 Mathematical Foundation</h6>
        <div className="formula-section">
          <p><strong>Loss Function (MSE):</strong></p>
          <code>L = 1/n · Σ(y_pred - y_actual)²</code>
        </div>
        <div className="formula-section">
          <p><strong>Gradient Calculation:</strong></p>
          <code>∂L/∂W = ∂L/∂y_pred · ∂y_pred/∂W</code>
        </div>
        <div className="formula-section">
          <p><strong>Weight Update Rule:</strong></p>
          <code>W_new = W_old - η · ∂L/∂W</code>
          <small>(η = learning rate)</small>
        </div>
      </div>
    </div>
  );
}
