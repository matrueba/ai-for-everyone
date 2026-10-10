import type { Dict } from "../../dict";

export const inference: Dict["inference"] = {
    title: "Inference",
    subtitle: "Learn how models generate predictions in real time.",

    intro: (
        <>
            Once training is finished the model is ready to run predictions on new data. That process is called{" "}
            <strong>inference</strong>. In the playground you can see how trained models use their parameters to
            generate real-time predictions for <strong>regression</strong> problems (predicting continuous values) and{" "}
            <strong>classification</strong> problems (predicting categories).
        </>
    ),

    params: {
        heading: "Parameters",
    },

    brain: {
        heading: "Intelligence",
        equation: "Learned Equation",
        result: "Result (Inference)",
    },

    plot: {
        dataName: "Data",
        modelName: "Model",
        projectionName: "Projection",
        keyPointsName: "Key Points",
        inputTooltip: "Input",
        predictionTooltip: "Prediction",
    },

    loading: (scenario: string) => `Training model for ${scenario}…`,
    loadingHint: "Optimizing weights via Gradient Descent",
    error: "Failed to train the model",
    retry: "Retry",

    scenarios: {
        generic: {
            tab: "Generic",
            title: "Generic Inference",
            description: "We map a two-dimensional input onto the model's plane.",
            x1Label: "Feature 1 (X₁)",
            x2Label: "Feature 2 (X₂)",
            yLabel: "Target (Y)",
        },
        houses: {
            tab: "Houses",
            title: "House Prices",
            description: "Price prediction based on square meters and a location score.",
            x1Label: "Area (m²)",
            x2Label: "Location (0-10)",
            yLabel: "Price (€)",
        },
        admission: {
            tab: "Admission",
            title: "Admission Classification",
            description:
                "Predicts the probability of university admission based on the exam score and hours of activities.",
            x1Label: "Exam Score",
            x2Label: "Activities (h/week)",
            yLabel: "Admission Prob.",
        },
    },
};
