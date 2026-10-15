import type { Dict } from "../../dict";

export const home: Dict["home"] = {
    eyebrow: "Learn AI by exploring",
    title: "AI for Everyone",
    subtitle:
        "An interactive journey through the inner workings of modern AI, from the first models to Transformers. Visualize, experiment and understand every piece.",

    actions: {
        start: "Start the journey",
        visualizer: "Open the Attention Visualizer",
    },

    path: {
        heading: "The journey",
        lead: "Seven stops, from the basics to attention inside a Transformer. Follow them in order or jump to the one you care about.",
    },

    sections: {
        history: "Eight decades of ideas, winters and breakthroughs that led to today's LLMs.",
        train: "What it means for a model to “learn”: data, predictions, error and adjustment.",
        "gradient-descent": "Watch the algorithm walk down the cost surface until it reaches the minimum.",
        inference: "Use already-trained models to predict values and classify in real time.",
        evaluation: "How to measure whether a model works well on data it has never seen.",
        "neural-network": "Drag a point and see which neurons light up in a real network.",
        visualizer: "Inspect how tokens attend to each other, layer by layer and head by head.",
    },

    comingSoon: "Coming soon",
};
