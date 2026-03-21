// App.jsx
import React, { useState, useEffect, useRef } from "react";
import Controls from "./components/controls.jsx";
import PerceptronCanvas from "./components/PerceptronCanvas.jsx";
import BackpropVisualization from "./components/BackpropVisualization.jsx";
import GradientFlow from "./components/GradientFlow.jsx";
import { trainNetwork, forward } from "./PerceptronSimulator.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Default small dataset (AND)
const DEFAULT_DATASET = [
  { x: [0, 0], y: 0 },
  { x: [0, 1], y: 0 },
  { x: [1, 0], y: 0 },
  { x: [1, 1], y: 1 },
];

// Initialize with sample weights (pre-trained for AND gate)
function initSampleWeights(inputCount = 2, hiddenCount = 4) {
  // These weights are pre-trained to solve the AND gate problem
  // This gives users a working example to understand the network
  return {
    inputToHidden: [
      [4.5, 4.5], // H1: Strongly activated by both inputs
      [3.2, 3.2], // H2: Moderately activated by both inputs
      [-2.1, 5.3], // H3: Responds more to second input
      [5.1, -1.8], // H4: Responds more to first input
    ],
    hiddenBias: [-6.8, -4.5, -2.3, -2.1], // Biases for hidden neurons
    hiddenToOutput: [8.2, 5.1, 3.4, 3.7], // Weights to output
    outputBias: -11.5, // Output bias
  };
}

// Initialize empty weights (for manual experimentation)
function initEmptyWeights(inputCount = 2, hiddenCount = 4) {
  return {
    inputToHidden: Array.from({ length: hiddenCount }, () =>
      Array(inputCount).fill("")
    ),
    hiddenBias: Array(hiddenCount).fill(""),
    hiddenToOutput: Array(hiddenCount).fill(""),
    outputBias: "",
  };
}

// Initialize random weights (for fresh training)
function initRandomWeights(inputCount = 2, hiddenCount = 4) {
  const randomWeight = () => (Math.random() * 2 - 1) * 2; // Range: -2 to 2
  return {
    inputToHidden: Array.from({ length: hiddenCount }, () =>
      Array.from({ length: inputCount }, randomWeight)
    ),
    hiddenBias: Array.from({ length: hiddenCount }, randomWeight),
    hiddenToOutput: Array.from({ length: hiddenCount }, randomWeight),
    outputBias: randomWeight(),
  };
}

// Activation functions
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
function step(x) {
  return x >= 0 ? 1 : 0;
}
function tanhFunc(x) {
  return Math.tanh(x);
}
function relu(x) {
  return Math.max(0, x);
}
function leakyRelu(x) {
  return x >= 0 ? x : 0.01 * x;
}
function linear(x) {
  return x;
}

function getActivationFunc(name) {
  switch (name) {
    case "Sigmoid":
      return sigmoid;
    case "Step":
      return step;
    case "Tanh":
      return tanhFunc;
    case "ReLU":
      return relu;
    case "LeakyReLU":
      return leakyRelu;
    case "Linear":
      return linear;
    default:
      return sigmoid;
  }
}

// Validate weights
function validateWeightsDetailed(weights) {
  for (let j = 0; j < weights.inputToHidden.length; j++) {
    for (let i = 0; i < weights.inputToHidden[j].length; i++) {
      const v = weights.inputToHidden[j][i];
      if (v === "" || v === null || isNaN(v))
        return `Input → Hidden weight H${j + 1} → I${i + 1} is missing`;
    }
  }
  for (let j = 0; j < weights.hiddenBias.length; j++) {
    const v = weights.hiddenBias[j];
    if (v === "" || v === null || isNaN(v))
      return `Hidden Bias bH${j + 1} is missing`;
  }
  for (let j = 0; j < weights.hiddenToOutput.length; j++) {
    const v = weights.hiddenToOutput[j];
    if (v === "" || v === null || isNaN(v))
      return `Hidden → Output weight H${j + 1} → O is missing`;
  }
  if (
    weights.outputBias === "" ||
    weights.outputBias === null ||
    isNaN(weights.outputBias)
  )
    return "Output Bias bO is missing";

  return true;
}

// ================= Weights Editor =================
function WeightsEditor({ weights, setWeights, setDisplayWeights }) {
  const handleChange = (path, index, subIndex, value) => {
    const newWeights = JSON.parse(JSON.stringify(weights));
    const parsed = parseFloat(value);
    if (path === "inputToHidden")
      newWeights.inputToHidden[index][subIndex] = isNaN(parsed) ? "" : parsed;
    else if (path === "hiddenBias")
      newWeights.hiddenBias[index] = isNaN(parsed) ? "" : parsed;
    else if (path === "hiddenToOutput")
      newWeights.hiddenToOutput[index] = isNaN(parsed) ? "" : parsed;
    else if (path === "outputBias")
      newWeights.outputBias = isNaN(parsed) ? "" : parsed;
    setWeights(newWeights);
    setDisplayWeights(newWeights);
  };

  return (
    <div>
      <h5 className="mb-3">Edit Weights</h5>
      <div className="d-flex flex-wrap gap-4">
        {/* Input → Hidden */}
        <div>
          <strong>Input → Hidden</strong>
          {weights.inputToHidden.map((row, j) => (
            <div key={j} className="mb-2">
              I → H{j + 1}
              <sub>w</sub>{" "}
              {row.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  step="0.1"
                  value={v}
                  onChange={(e) =>
                    handleChange("inputToHidden", j, i, e.target.value)
                  }
                  className={`form-control d-inline-block me-2 ${
                    v === "" ? "border-danger" : ""
                  }`}
                  style={{ width: 100 }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="col-md-3">
          <strong>Hidden Bias</strong>
          {weights.hiddenBias.map((v, j) => (
            <div key={j} className="mb-2 ">
              b<sub>H{j + 1}</sub>{" "}
              <input
                type="number"
                step="0.1"
                value={v}
                onChange={(e) =>
                  handleChange("hiddenBias", j, null, e.target.value)
                }
                className={`form-control d-inline-block me-2 ${
                  v === "" ? "border-danger" : ""
                }`}
                style={{ width: 100 }}
              />
            </div>
          ))}
        </div>

        {/* Hidden → Output */}
        <div>
          <strong>Hidden → Output</strong>
          {weights.hiddenToOutput.map((v, j) => (
            <div key={j} className="mb-2">
              H{j + 1}
              <sub>w</sub> → O{" "}
              <input
                type="number"
                step="0.1"
                value={v}
                onChange={(e) =>
                  handleChange("hiddenToOutput", j, null, e.target.value)
                }
                className={`form-control d-inline-block me-2 ${
                  v === "" ? "border-danger" : ""
                }`}
                style={{ width: 100 }}
              />
            </div>
          ))}
        </div>

        {/* Output Bias */}
        <div>
          <strong>Output Bias</strong>
          <div className="mt-2 d-flex align-items-center">
            <label className="me-2 mb-0">
              b<sub>O</sub>
            </label>
            <input
              type="number"
              step="0.1"
              value={weights.outputBias}
              onChange={(e) =>
                handleChange("outputBias", null, null, e.target.value)
              }
              className={`form-control ${
                weights.outputBias === "" ? "border-danger" : ""
              }`}
              style={{ width: 100 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= Main App =================
export default function App() {
  const [config, setConfig] = useState({
    activation: "Sigmoid",
    lr: 0.3,
    epochs: 15,
  });
  const [weights, setWeights] = useState(() => initSampleWeights(2, 4));
  const [displayWeights, setDisplayWeights] = useState(() =>
    initSampleWeights(2, 4)
  );
  const [finalOutput, setFinalOutput] = useState(null);
  const [epoch, setEpoch] = useState(0);
  const [training, setTraining] = useState(false);
  const [loss, setLoss] = useState(null);
  const [selectedInput, setSelectedInput] = useState([0, 0]);
  const [hasTrained, setHasTrained] = useState(true); // Set to true since we start with trained weights

  const intervalRef = useRef(null);

  const computeLoss = (dataset, weights, activationFunc) => {
    let total = 0;
    for (const sample of dataset) {
      const f = forward(sample.x, weights, activationFunc);
      total += Math.pow(sample.y - f.outA, 2);
    }
    return total / dataset.length;
  };

  // ========= TRAIN =========
  const onTrain = () => {
    const validation = validateWeightsDetailed(weights);
    if (validation !== true) {
      alert(`Cannot train! ${validation}`);
      return;
    }

    const activationFunc = getActivationFunc(config.activation);
    const wClone = JSON.parse(JSON.stringify(weights));
    setEpoch(0);
    setTraining(true);
    setLoss(null);
    setHasTrained(true);

    let currentWeights = JSON.parse(JSON.stringify(wClone));
    let epochCount = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (epochCount >= config.epochs) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTraining(false);
        // Final output & loss after last epoch
        try {
          const f = forward(selectedInput, currentWeights, activationFunc);
          setFinalOutput(Number(f.outA.toFixed(3)));
        } catch {
          setFinalOutput(null);
        }
        const currentLoss = computeLoss(DEFAULT_DATASET, currentWeights, activationFunc);
        setLoss(Number(currentLoss.toFixed(4)));
        return;
      }

      const hist = trainNetwork(currentWeights, DEFAULT_DATASET, 1, config.lr, activationFunc, config.activation);
      currentWeights = hist[hist.length - 1];
      epochCount++;

      setWeights(JSON.parse(JSON.stringify(currentWeights)));
      setDisplayWeights(currentWeights);
      setEpoch(epochCount);

      // Live output & loss
      try {
        const f = forward(selectedInput, currentWeights, activationFunc);
        setFinalOutput(Number(f.outA.toFixed(3)));
      } catch {
        setFinalOutput(null);
      }
      const currentLoss = computeLoss(DEFAULT_DATASET, currentWeights, activationFunc);
      setLoss(Number(currentLoss.toFixed(4)));
    }, 500);
  };

  const onPlay = () => {
    if (training || epoch >= config.epochs) return;
    const activationFunc = getActivationFunc(config.activation);
    let currentWeights = JSON.parse(JSON.stringify(weights));
    let epochCount = epoch;
    setTraining(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (epochCount >= config.epochs) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTraining(false);
        try {
          const f = forward(selectedInput, currentWeights, activationFunc);
          setFinalOutput(Number(f.outA.toFixed(3)));
        } catch {
          setFinalOutput(null);
        }
        const currentLoss = computeLoss(DEFAULT_DATASET, currentWeights, activationFunc);
        setLoss(Number(currentLoss.toFixed(4)));
        return;
      }

      const hist = trainNetwork(currentWeights, DEFAULT_DATASET, 1, config.lr, activationFunc, config.activation);
      currentWeights = hist[hist.length - 1];
      epochCount++;

      setWeights(JSON.parse(JSON.stringify(currentWeights)));
      setDisplayWeights(currentWeights);
      setEpoch(epochCount);

      try {
        const f = forward(selectedInput, currentWeights, activationFunc);
        setFinalOutput(Number(f.outA.toFixed(3)));
      } catch {
        setFinalOutput(null);
      }
      const currentLoss = computeLoss(DEFAULT_DATASET, currentWeights, activationFunc);
      setLoss(Number(currentLoss.toFixed(4)));
    }, 500);
  };

  const onPause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTraining(false);
  };

  // Reset with empty weights
  const onResetWeights = () => {
    const w = initEmptyWeights(2, 4);
    setWeights(w);
    setDisplayWeights(w);
    setFinalOutput(null);
    setEpoch(0);
    setTraining(false);
    setLoss(null);
    setHasTrained(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Load sample pre-trained weights
  const onLoadSampleWeights = () => {
    const w = initSampleWeights(2, 4);
    const activationFunc = getActivationFunc(config.activation);
    setWeights(w);
    setDisplayWeights(w);
    setEpoch(0);
    setTraining(false);
    setHasTrained(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Compute output and loss for sample weights
    try {
      const f = forward(selectedInput, w, activationFunc);
      setFinalOutput(Number(f.outA.toFixed(3)));
    } catch {
      setFinalOutput(null);
    }
    const currentLoss = computeLoss(DEFAULT_DATASET, w, activationFunc);
    setLoss(Number(currentLoss.toFixed(4)));
  };

  // Load random weights
  const onLoadRandomWeights = () => {
    const w = initRandomWeights(2, 4);
    const activationFunc = getActivationFunc(config.activation);
    setWeights(w);
    setDisplayWeights(w);
    setEpoch(0);
    setTraining(false);
    setHasTrained(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Compute output and loss for random weights
    try {
      const f = forward(selectedInput, w, activationFunc);
      setFinalOutput(Number(f.outA.toFixed(3)));
    } catch {
      setFinalOutput(null);
    }
    const currentLoss = computeLoss(DEFAULT_DATASET, w, activationFunc);
    setLoss(Number(currentLoss.toFixed(4)));
  };

  const onStep = () => {
    if (!training) {
      const validation = validateWeightsDetailed(weights);
      if (validation !== true) {
        alert(`Cannot step! ${validation}`);
        return;
      }

      const activationFunc = getActivationFunc(config.activation);
      const wClone = JSON.parse(JSON.stringify(weights));
      const hist = trainNetwork(wClone, DEFAULT_DATASET, 1, config.lr, activationFunc, config.activation);
      const newWeights = hist[hist.length - 1];
      setWeights(JSON.parse(JSON.stringify(newWeights)));
      setDisplayWeights(newWeights);
      setEpoch((prev) => prev + 1);

      try {
        const f = forward(selectedInput, newWeights, activationFunc);
        setFinalOutput(Number(f.outA.toFixed(3)));
      } catch {
        setFinalOutput(null);
      }
      const currentLoss = computeLoss(DEFAULT_DATASET, newWeights, activationFunc);
      setLoss(Number(currentLoss.toFixed(4)));
    }
  };

  // recompute output when input/weights change, only if training is not active
  useEffect(() => {
    if (
      !training &&
      hasTrained &&
      validateWeightsDetailed(displayWeights) === true
    ) {
      const activationFunc = getActivationFunc(config.activation);
      try {
        const f = forward(selectedInput, displayWeights, activationFunc);
        setFinalOutput(Number(f.outA.toFixed(3)));
      } catch {
        setFinalOutput(null);
      }
      const currentLoss = computeLoss(DEFAULT_DATASET, displayWeights, activationFunc);
      setLoss(Number(currentLoss.toFixed(4)));
    }
  }, [displayWeights, selectedInput, training, hasTrained, config.activation]);

  return (
    <div className="container py-3">
      <header className="text-center mb-4">
        <h1 className="mb-1">Neural Network Playground</h1>
        <p
          className="text-white fw-light"
          style={{
            fontSize: "1.1rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Interactive visualization of neural networks
        </p>
      </header>

      <div className="row mb-4">
        <div className="col-md-5 bg-light p-3 shadow-sm">
          <Controls
            config={config}
            setConfig={setConfig}
            onTrain={onTrain}
            onPlay={onPlay}
            onPause={onPause}
            onStep={onStep}
            onResetWeights={onResetWeights}
            animPlaying={training}
          />

          <div className="mt-3 input-selector-container">
            <label className="form-label fw-bold">
              <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>
                🎯
              </span>
              Select Input Combination
            </label>
            <select
              className="form-select"
              style={{ fontSize: "1rem", fontWeight: "500" }}
              value={selectedInput.join(",")}
              onChange={(e) =>
                setSelectedInput(e.target.value.split(",").map(Number))
              }
            >
              <option value="0,0">[0, 0]</option>
              <option value="0,1">[0, 1]</option>
              <option value="1,0">[1, 0]</option>
              <option value="1,1">[1, 1]</option>
            </select>
          </div>

          {/* Weight Initialization Options */}
          <div
            className="mt-3 weight-init-container"
            style={{
              background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              padding: "15px",
              borderRadius: "8px",
              border: "2px solid #2196f3",
            }}
          >
            <label className="form-label fw-bold" style={{ color: "#1565c0" }}>
              <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>
                ⚙️
              </span>
              Initialize Weights
            </label>
            <div className="d-grid gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={onLoadSampleWeights}
                style={{ fontWeight: "600" }}
              >
                ✨ Load Sample Weights (Pre-trained)
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onLoadRandomWeights}
                style={{ fontWeight: "600" }}
              >
                🎲 Load Random Weights
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={onResetWeights}
                style={{ fontWeight: "600" }}
              >
                🗑️ Clear All Weights
              </button>
            </div>
            <small
              className="text-muted d-block mt-2"
              style={{ fontSize: "0.85rem" }}
            >
              💡 <strong>Tip:</strong> Start with sample weights to see a
              trained network, then try training from random or empty weights!
            </small>
          </div>
        </div>

        <div className="col-md-7 bg-light p-3 weights-editor-container">
          <WeightsEditor
            weights={weights}
            setWeights={setWeights}
            setDisplayWeights={setDisplayWeights}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-7 bg-white shadow-sm">
          <PerceptronCanvas
            inputs={selectedInput}
            weights={displayWeights}
            width={820}
            height={420}
            activation={getActivationFunc(config.activation)}
          />
        </div>
        <div className="col-md-5 bg-white p-3 shadow-sm output-panel">
          <h5 className="output-title">
            <span style={{ fontSize: "1.3rem", marginRight: "0.5rem" }}>
              📈
            </span>
            Output & Metrics
          </h5>

          <div className="output-display">
            <div className="metric-card">
              <label className="metric-label">Prediction</label>
              {finalOutput === null ? (
                <p className="text-muted">Press Train to see output</p>
              ) : (
                <div className="prediction-result">
                  [{selectedInput.join(", ")}] →{" "}
                  <span className="result-value">{finalOutput}</span>
                </div>
              )}
            </div>

            <div className="metric-card">
              <label className="metric-label">Training Progress</label>
              <div className="progress-info">
                <strong style={{ fontSize: "1.1rem", color: "#667eea" }}>
                  {epoch}
                </strong>
                <span style={{ margin: "0 0.5rem", color: "#9ca3af" }}>/</span>
                <strong style={{ fontSize: "1.1rem", color: "#764ba2" }}>
                  {config.epochs}
                </strong>
                {training && (
                  <span className="training-badge">
                    <span className="spinner"></span>
                    Training...
                  </span>
                )}
              </div>
            </div>

            <div className="metric-card">
              <label className="metric-label">Loss (MSE)</label>
              <div className="loss-display">
                {loss !== null ? (
                  <span className="loss-value">{loss}</span>
                ) : (
                  <span className="text-muted">Not computed yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backpropagation Visualization */}
      <div className="row mb-4">
        <div className="col-12">
          <BackpropVisualization
            isTraining={training}
            epoch={epoch}
            loss={loss}
            showExplanation={true}
          />
        </div>
      </div>

      {/* Gradient Flow Details */}
      <div className="row mb-4">
        <div className="col-12">
          <GradientFlow
            weights={displayWeights}
            dataset={DEFAULT_DATASET}
            learningRate={config.lr}
          />
        </div>
      </div>
    </div>
  );
}
