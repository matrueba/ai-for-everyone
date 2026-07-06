import type { NNPlaygroundResponse } from "../../api";

export interface ForwardPass {
    input: [number, number];
    hiddenZ: number[]; // pre-activation (weighted sum + bias)
    hiddenA: number[]; // post-activation (ReLU)
    outputZ: number;
    outputA: number;   // sigmoid probability
}

export function sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
}

export function forward(net: NNPlaygroundResponse, x1: number, x2: number): ForwardPass {
    const hiddenSize = net.b1.length;
    const hiddenZ: number[] = [];
    const hiddenA: number[] = [];

    for (let j = 0; j < hiddenSize; j++) {
        const z = (net.W1[0]?.[j] ?? 0) * x1 + (net.W1[1]?.[j] ?? 0) * x2 + (net.b1[j] ?? 0);
        hiddenZ.push(z);
        hiddenA.push(Math.max(0, z));
    }

    let outputZ = net.b2;
    for (let j = 0; j < hiddenSize; j++) {
        outputZ += (net.W2[j] ?? 0) * (hiddenA[j] ?? 0);
    }

    return { input: [x1, x2], hiddenZ, hiddenA, outputZ, outputA: sigmoid(outputZ) };
}

export type SelectedNeuron =
    | { layer: "input"; index: number }
    | { layer: "hidden"; index: number }
    | { layer: "output"; index: number }
    | null;
