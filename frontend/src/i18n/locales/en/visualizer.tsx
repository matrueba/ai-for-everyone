import type { Dict } from "../../dict";

export const visualizer: Dict["visualizer"] = {
    page: {
        title: "Attention Visualizer",
        subtitle:
            "Explore the core mechanism of the Transformer architecture through interactive theory and real-time visualization.",
        tabTheory: "Theory",
        tabPlayground: "Playground",
    },

    story: {
        heading: "The Transformer Story",
        sections: {
            1: {
                title: "The Sequential Problem",
                body: (
                    <>
                        Before Transformers, models like RNNs and LSTMs processed text word by word, from left to right.
                        This was slow and had trouble remembering things that happened far back in a long sentence.
                    </>
                ),
            },
            2: {
                title: "Enter Attention",
                body: (
                    <>
                        In 2017, researchers proposed “Attention is All You Need”. Instead of processing one word at a
                        time, the model looks at <strong>all words simultaneously</strong>.
                    </>
                ),
            },
            3: {
                title: "Self-Attention in Action",
                body: (
                    <>
                        When the model processes the word “it” in a sentence, self-attention allows it to associate “it”
                        with the correct noun mentioned earlier, like “the store” or “the cat”.
                    </>
                ),
            },
            4: {
                title: "Multi-Head Architecture",
                body: (
                    <>
                        By using multiple “heads”, the model can attend to different aspects of the text at the same
                        time: one head might focus on grammar, while another focuses on semantic relationships.
                    </>
                ),
            },
        },
        quote: "“Attention is the mechanism that allows a model to weigh the importance of different parts of the input data.”",
        footer: (
            <>
                Switch to the <strong>Playground tab</strong> above to see the attention weights for your own sentences.
            </>
        ),
    },

    playground: {
        inputLabel: "Input Sentence",
        // The toy Transformer uses an English tokenizer (bert-base-uncased),
        // so the sample sentence stays in English in every locale.
        defaultSentence: "At the store, she bought apples, oranges, bananas,",
        placeholder: "Type a sentence to analyze…",
        analyze: "Analyze",
        analyzing: "Analyzing…",
        layer: "Layer",
        head: "Head",
        viewLines: "Flow",
        viewHeatmap: "Heatmap",
        viewMatrix: "Matrix",
        chips: {
            layers: "Layers",
            heads: "Heads",
        },
        runningForward: "Running forward pass…",
        emptyTitle: "Ready to Analyze",
        emptyBody: "Enter a sentence above to see the Transformer in action.",
        panelLines: "Attention Flow",
        panelHeatmap: "Attention Heatmap",
        panelMatrix: "Q / K Matrix",
        layerHead: (layer: number, head: number) => `Layer ${layer} · Head ${head}`,
        tokensTitle: "Tokenized Input",
        tokensCount: (n: number) => `${n} tokens`,
    },

    matrix: {
        tabVectors: "Q & K Vectors",
        tabProduct: "Q × Kᵀ Matrix",
        noData: "No query/key data available for this layer and head.",
        matrixTitle: (name: string) => `${name} matrix`,
        selectedToken: (token: string, index: number) => (
            <>
                Selected token: <span className="text-accent-indigo font-semibold">{token}</span> (index {index}) — click
                another cell to change
            </>
        ),
    },
};
