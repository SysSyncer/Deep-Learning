// PerceptronSimulator.js
// Small 2 -> 4 -> 1 neural network with basic backprop (MSE + SGD).
// Supports multiple activation functions.

// Activation functions
export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function step(x) {
  return x >= 0 ? 1 : 0;
}

export function tanhFunc(x) {
  return Math.tanh(x);
}

export function relu(x) {
  return Math.max(0, x);
}

export function leakyRelu(x) {
  return x >= 0 ? x : 0.01 * x;
}

export function linear(x) {
  return x;
}

// Derivative functions (given the output y = activation(z))
export function sigmoidDerivFromOutput(y) {
  return y * (1 - y);
}

export function stepDerivFromOutput(y) {
  // Step function has zero derivative everywhere except at 0 (undefined)
  // For practical purposes, we use a small constant
  return 0.01;
}

export function tanhDerivFromOutput(y) {
  return 1 - y * y;
}

export function reluDerivFromInput(z) {
  // ReLU derivative depends on input z, not output
  return z >= 0 ? 1 : 0;
}

export function leakyReluDerivFromInput(z) {
  return z >= 0 ? 1 : 0.01;
}

export function linearDerivFromOutput(y) {
  return 1;
}

// Helper to get derivative function
export function getActivationDerivative(activationName) {
  switch (activationName) {
    case 'Sigmoid':
      return { fromOutput: sigmoidDerivFromOutput, useInput: false };
    case 'Step':
      return { fromOutput: stepDerivFromOutput, useInput: false };
    case 'Tanh':
      return { fromOutput: tanhDerivFromOutput, useInput: false };
    case 'ReLU':
      return { fromInput: reluDerivFromInput, useInput: true };
    case 'LeakyReLU':
      return { fromInput: leakyReluDerivFromInput, useInput: true };
    case 'Linear':
      return { fromOutput: linearDerivFromOutput, useInput: false };
    default:
      return { fromOutput: sigmoidDerivFromOutput, useInput: false };
  }
}

export function initWeights(inputCount, hiddenCount) {
  return {
    inputToHidden: Array.from({ length: hiddenCount }, () =>
      Array.from({ length: inputCount }, () => "")
    ),
    hiddenBias: Array.from({ length: hiddenCount }, () => ""),
    hiddenToOutput: Array.from({ length: hiddenCount }, () => ""),
    outputBias: "",
  };
}

export function forward(x, weights, activationFunc = sigmoid) {
  const { inputToHidden, hiddenBias, hiddenToOutput, outputBias } = weights;
  // hidden pre-activation
  const hiddenZ = inputToHidden.map((wRow, j) =>
    wRow.reduce((s, w, i) => s + w * x[i], 0) + (hiddenBias[j] || 0)
  );
  const hiddenA = hiddenZ.map(z => activationFunc(z));
  const outZ = hiddenToOutput.reduce((s, wj, j) => s + wj * hiddenA[j], 0) + (outputBias || 0);
  const outA = activationFunc(outZ);
  return { hiddenZ, hiddenA, outZ, outA };
}

function cloneWeights(w) {
  return JSON.parse(JSON.stringify(w));
}

/**
 * trainNetwork
 * - weights: initial weights object (will be mutated)
 * - dataset: array of { x: [a,b], y: 0|1 }
 * - epochs: integer
 * - lr: learning rate
 * - activationFunc: activation function to use (default: sigmoid)
 * - activationName: name of activation function for derivative lookup (default: 'Sigmoid')
 * Returns: weightHistory[] (array of weight snapshots, length epochs+1)
 */
export function trainNetwork(weights, dataset, epochs = 20, lr = 0.2, activationFunc = sigmoid, activationName = 'Sigmoid') {
  const history = [cloneWeights(weights)];
  const derivInfo = getActivationDerivative(activationName);

  for (let e = 0; e < epochs; e++) {
    // shuffle dataset (simple Fisher-Yates)
    for (let i = dataset.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dataset[i], dataset[j]] = [dataset[j], dataset[i]];
    }

    for (const sample of dataset) {
      const x = sample.x;
      const y = sample.y;
      const f = forward(x, weights, activationFunc);
      const yPred = f.outA;
      const error = yPred - y; // d(E)/d(yPred) for MSE where E = (yPred-y)^2

      // Output layer delta
      let deltaOut;
      if (derivInfo.useInput) {
        deltaOut = error * derivInfo.fromInput(f.outZ);
      } else {
        deltaOut = error * derivInfo.fromOutput(yPred);
      }

      // Gradients for hidden->output weights and output bias
      for (let j = 0; j < weights.hiddenToOutput.length; j++) {
        const grad = deltaOut * f.hiddenA[j];
        weights.hiddenToOutput[j] -= lr * grad;
      }
      weights.outputBias -= lr * deltaOut;

      // Hidden layer deltas and update input->hidden weights
      for (let j = 0; j < weights.inputToHidden.length; j++) {
        const w_ho = weights.hiddenToOutput[j];
        
        let deltaHidden;
        if (derivInfo.useInput) {
          deltaHidden = deltaOut * w_ho * derivInfo.fromInput(f.hiddenZ[j]);
        } else {
          deltaHidden = deltaOut * w_ho * derivInfo.fromOutput(f.hiddenA[j]);
        }

        for (let i = 0; i < weights.inputToHidden[j].length; i++) {
          const grad = deltaHidden * x[i];
          weights.inputToHidden[j][i] -= lr * grad;
        }
        weights.hiddenBias[j] -= lr * deltaHidden;
      }
    } // end dataset loop

    // snapshot after each epoch
    history.push(cloneWeights(weights));
  }

  return history;
}
