// Controls.jsx
import React, { useState } from "react";
import "./controls.css";

export default function Controls({
  config,
  setConfig,
  onTrain,
  onPlay,
  onPause,
  onStep,
  onResetWeights,
  animPlaying,
}) {
  const [local, setLocal] = useState(config);

  function updateLocal(next) {
    const merged = { ...local, ...next };
    setLocal(merged);
    setConfig(merged);
  }

  const activations = ["Sigmoid", "Step", "Tanh", "ReLU", "LeakyReLU", "Linear"];

  return (
    <div className="controls-container">
      <h3 className="controls-title">
        <span className="icon">⚙️</span> Training Controls
      </h3>
      
      <div className="info-banner">
        <span className="info-icon">✨</span>
        <small>
          All activation functions fully supported for training! Try ReLU, Tanh, Sigmoid, and more.
        </small>
      </div>

      {/* Activation Dropdown */}
      <div className="control-group">
        <label className="control-label">
          <span className="label-icon">🧠</span>
          Activation Function
        </label>
        <select 
          className="control-select" 
          value={local.activation} 
          onChange={(e) => updateLocal({ activation: e.target.value })}
        >
          {activations.map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
      </div>

      {/* Learning Rate */}
      <div className="control-group">
        <label className="control-label">
          <span className="label-icon">📈</span>
          Learning Rate
        </label>
        <input
          className="control-input"
          type="number"
          step="0.01"
          min="0.01"
          max="1"
          value={local.lr}
          onChange={(e) => updateLocal({ lr: Number(e.target.value) })}
        />
        <div className="value-indicator">{local.lr}</div>
      </div>

      {/* Epochs */}
      <div className="control-group">
        <label className="control-label">
          <span className="label-icon">🔄</span>
          Epochs
        </label>
        <input
          className="control-input"
          type="number"
          min="1"
          max="1000"
          value={local.epochs}
          onChange={(e) => updateLocal({ epochs: Number(e.target.value) })}
        />
        <div className="value-indicator">{local.epochs} iterations</div>
      </div>

      {/* Action Buttons */}
      <div className="button-grid">
        <button
          className="btn btn-primary btn-train"
          onClick={onTrain}
          disabled={animPlaying}
        >
          <span className="btn-icon">🚀</span>
          Train
        </button>
        
        <button 
          className="btn btn-success btn-play" 
          onClick={() => onPlay()} 
          disabled={animPlaying}
        >
          <span className="btn-icon">▶️</span>
          Play
        </button>
        
        <button 
          className="btn btn-warning btn-pause" 
          onClick={() => onPause()} 
          disabled={!animPlaying}
        >
          <span className="btn-icon">⏸️</span>
          Pause
        </button>
        
        <button 
          className="btn btn-info btn-step" 
          onClick={() => onStep()}
          disabled={animPlaying}
        >
          <span className="btn-icon">⏭️</span>
          Step
        </button>
      </div>

      {/* Reset Button */}
      <button 
        className="btn btn-danger btn-reset" 
        onClick={() => onResetWeights()}
      >
        <span className="btn-icon">🔄</span>
        Reset Weights
      </button>
    </div>
  );
}

