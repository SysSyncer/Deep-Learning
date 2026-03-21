import React, { useRef, useEffect } from "react";

// === Canvas Drawing Function ===
function drawNetwork(ctx, width, height, inputs, weights, activationFunc) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = "round";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";

  const inputCount = inputs.length;
  const hiddenCount = weights.hiddenBias.length;

  const paddingX = 100;
  const nodeRadius = 18;

  const inputLayerX = paddingX;
  const hiddenLayerX = width / 2 - 50;
  const outputLayerX = width - paddingX;

  const inputY = Array.from({ length: inputCount }, (_, i) => ((i + 1) * height) / (inputCount + 1));
  const hiddenY = Array.from({ length: hiddenCount }, (_, j) => ((j + 1) * height) / (hiddenCount + 1));
  const outputY = [height / 2];

  // === Compute hidden activations ===
  let hiddenActivations = [];
  for (let j = 0; j < hiddenCount; j++) {
    let sum = Number(weights.hiddenBias[j] || 0);
    for (let i = 0; i < inputCount; i++) {
      sum += (Number(inputs[i]) || 0) * (Number(weights.inputToHidden[j][i]) || 0);
    }
    hiddenActivations[j] = activationFunc(sum);
  }

  // === Compute output activation ===
  let outputSum = Number(weights.outputBias || 0);
  for (let j = 0; j < hiddenCount; j++) {
    outputSum += hiddenActivations[j] * (Number(weights.hiddenToOutput[j]) || 0);
  }
  const outputActivation = activationFunc(outputSum);

  // === Draw connections: Input → Hidden ===
  for (let i = 0; i < inputCount; i++) {
    for (let j = 0; j < hiddenCount; j++) {
      const w = Number(weights.inputToHidden[j][i]) || 0;
      ctx.beginPath();
      ctx.moveTo(inputLayerX, inputY[i]);
      ctx.lineTo(hiddenLayerX, hiddenY[j]);
      ctx.lineWidth = Math.max(1, Math.abs(w) * 4);
      ctx.strokeStyle = w >= 0 ? "rgba(62,98,62,0.6)" : "rgba(161,43,43,0.6)";
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = "black";
      ctx.fillText(w.toFixed(2), (inputLayerX + hiddenLayerX) / 2, (inputY[i] + hiddenY[j]) / 2);
    }
  }

  // === Draw connections: Hidden → Output ===
  for (let j = 0; j < hiddenCount; j++) {
    const w = Number(weights.hiddenToOutput[j]) || 0;
    ctx.beginPath();
    ctx.moveTo(hiddenLayerX, hiddenY[j]);
    ctx.lineTo(outputLayerX, outputY[0]);
    ctx.lineWidth = Math.max(1, Math.abs(w) * 4);
    ctx.strokeStyle = w >= 0 ? "rgba(27,122,27,0.6)" : "rgba(161,43,43,0.6)";
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fillText(w.toFixed(2), (hiddenLayerX + outputLayerX) / 2, (hiddenY[j] + outputY[0]) / 2);
  }

  // === Draw input nodes ===
  for (let i = 0; i < inputCount; i++) {
    ctx.beginPath();
    ctx.arc(inputLayerX, inputY[i], nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#b3d9ff"; // light blue
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText((Number(inputs[i]) || 0).toFixed(2), inputLayerX, inputY[i] + 4);
  }

  // === Draw hidden nodes ===
  for (let j = 0; j < hiddenCount; j++) {
    ctx.beginPath();
    ctx.arc(hiddenLayerX, hiddenY[j], nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#d5f5e3"; // light green
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(hiddenActivations[j].toFixed(2), hiddenLayerX, hiddenY[j] + 4);
  }

  // === Draw output node ===
  ctx.beginPath();
  ctx.arc(outputLayerX, outputY[0], nodeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#f9e79f"; // light yellow
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fillText(outputActivation.toFixed(2), outputLayerX, outputY[0] + 4);
}

// === Canvas Component ===
export default function PerceptronCanvas({ inputs, weights, activation }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!activation) return; // safety check
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawNetwork(ctx, canvas.width, canvas.height, inputs, weights, activation);
  }, [inputs, weights, activation]);

  return (
    <canvas
      ref={canvasRef}
      width={820}
      height={420}
      style={{ border: "1px solid #ccc", marginTop: 20, borderRadius: 6 }}
    />
  );
}
