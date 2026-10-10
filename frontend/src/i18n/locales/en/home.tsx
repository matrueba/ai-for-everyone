import type { Dict } from "../../dict";

export const home: Dict["home"] = {
    title: "AI for Everyone",
    subtitle:
        "An interactive playground through the inner workings of modern AI. Visualize, analyze, and understand how AI works.",

    cards: {
        attention: {
            title: "Attention Flow",
            body: "Visualize how tokens “attend” to each other across different layers and heads. Understand how context is built and information flows through the network.",
        },
        matrix: {
            title: "Matrix Deep-Dive",
            body: "Inspect the Query and Key vectors that drive the attention mechanism. See exactly how the dot-product similarity shapes the attention scores.",
        },
    },

    gettingStarted: {
        heading: "How to get started",
        steps: {
            1: "Open the Visualizer",
            2: "Enter your text",
            3: "Analyze & explore",
        },
    },
};
