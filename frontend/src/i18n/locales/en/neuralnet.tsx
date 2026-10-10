import type { Dict } from "../../dict";

export const neuralnet: Dict["neuralnet"] = {
    header: {
        title: "Neurons in Action",
        subtitle: "Watch the neurons of a real neural network fire while it runs an inference.",
    },

    connectionError: "Could not reach the backend. Start the server on port 8000.",
    training: "Training the neural network…",

    problem: (hiddenSize: number) => (
        <>
            This neural network (2 inputs → {hiddenSize} hidden neurons → 1 output) was trained to solve a simple
            problem: deciding whether a point <span className="font-mono">(x₁, x₂)</span> is{" "}
            <strong className="text-indigo-600">inside</strong> or <strong className="text-orange-600">outside</strong>{" "}
            a circle. A linear model cannot solve it, but a single hidden layer can.{" "}
            <strong>Drag the point</strong> across the map (or use the sliders) and watch which neurons light up and
            what signal flows through each connection.
        </>
    ),

    inputSpace: "Input space",

    prediction: {
        heading: "Prediction",
        probabilityInside: "probability of being inside",
        activeNeurons: "Active hidden neurons:",
        accuracy: "Network accuracy:",
    },

    graph: {
        heading: "Inside the network",
        propagate: "▶ Propagate signal step by step",
        ariaLabel: "Neural network graph",
        layers: {
            input: "Input",
            hidden: "Hidden layer · ReLU",
            output: "Output · Sigmoid",
        },
        inactive: "inactive",
        inside: "Inside the circle",
        outside: "Outside the circle",
        legend: {
            positive: "positive weight",
            negative: "negative weight",
            thickness: "thickness = weight magnitude · brightness = flowing signal",
            hint: "click a neuron to see its computation",
        },
    },

    canvas: {
        ariaLabel: "Input space: drag the point to change x1 and x2",
    },

    steps: {
        1: "1 · The input values (x₁, x₂) reach the neurons of the first layer.",
        2: "2 · Each connection multiplies the value by its weight w. Brighter lines carry more signal.",
        3: "3 · Each hidden neuron adds up its weighted inputs plus its bias and applies ReLU: if the sum is negative, the neuron does not fire.",
        4: "4 · The activations of the firing neurons travel towards the output layer.",
        5: "5 · The sigmoid function turns the final sum into a probability between 0 and 1.",
    },

    inspector: {
        inputTitle: (index: number) => `Input neuron x${index}`,
        inputBody:
            "Input neurons compute nothing: they simply pass the feature value along to the hidden layer.",
        inputValue: "value",

        hiddenTitle: (index: number) => `Hidden neuron #${index}`,
        hiddenBody: (
            <>
                It first computes the <strong>weighted sum</strong> of its inputs plus the bias, and then applies the{" "}
                <strong>ReLU</strong> activation function: <span className="font-mono">max(0, z)</span>.
            </>
        ),
        hiddenInactive: " Since z is negative, this neuron does not fire (output 0).",

        outputTitle: "Output neuron",
        outputBody: (
            <>
                It sums the activations of every hidden neuron (weighted by their weights) and applies the{" "}
                <strong>sigmoid</strong> to obtain a probability between 0 and 1.
            </>
        ),
    },

    theory: {
        weighted: {
            title: "Weighted sum",
            body: (
                <>
                    Each neuron multiplies every input by a <strong>weight</strong> (learned during training) and adds a{" "}
                    <strong>bias</strong>. Positive weights (indigo lines) excite the neuron; negative ones (orange
                    lines) inhibit it.
                </>
            ),
        },
        relu: {
            title: "ReLU activation",
            body: (
                <>
                    The function <span className="font-mono">ReLU(z) = max(0, z)</span> decides whether the neuron
                    “fires”. If the weighted sum is negative, the neuron stays <strong>inactive</strong> and
                    contributes nothing. This non-linearity is what lets the network learn curved boundaries like the
                    circle.
                </>
            ),
        },
        concepts: {
            title: "From neurons to concepts",
            body: (
                <>
                    Each hidden neuron learns to detect a “stripe” of the input space. The output layer combines those
                    simple detections into the circular boundary. LLMs work on the same principle, only with{" "}
                    <strong>billions</strong> of neurons.
                </>
            ),
        },
    },
};
