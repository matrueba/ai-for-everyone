import type { Dict } from "../../dict";

export const common: Dict["common"] = {
    appName: "AI for Everyone",

    menu: {
        home: "Home",
        history: "History of AI",
        train: "Training",
        "gradient-descent": "Gradient Descent",
        inference: "Inference",
        "neural-network": "Neurons in Action",
        evaluation: "Evaluation",
        visualizer: "Attention Visualizer",
    },

    nav: {
        label: "Main navigation",
        groups: {
            fundamentals: "Fundamentals",
            networks: "Neural networks & LLMs",
        },
        openMenu: "Open menu",
        closeMenu: "Close menu",
        next: "Next step",
    },

    sidebar: {
        status: "Status",
        backendOnline: "Backend online",
        backendOffline: "Backend unavailable",
        backendChecking: "Checking backend…",
    },

    chart3d: {
        resetView: "Reset view",
        dragHint: "Drag to rotate · scroll to zoom",
        costLow: "low cost",
        costHigh: "high cost",
        start: "Start",
        nextStep: "Next step (−∇)",
        residuals: "Errors (residuals)",
        boundary: "Boundary p = 0.5",
    },

    theme: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
    },

    language: {
        label: "Language",
        es: "Español",
        en: "English",
        switchTo: "Switch to English",
    },

    footer: {
        copyright: "© 2026 AI for Everyone",
        github: "GitHub Source",
    },

    actions: {
        retry: "Retry",
        reset: "Reset",
        play: "Start training",
        pause: "Pause",
    },

    labels: {
        iteration: "Iteration",
        cost: "Cost",
        logLoss: "Log Loss",
        learningRate: "LR",
    },

    states: {
        loading: "Loading…",
        noData: "No data available",
        noData3d: "No data available for 3D visualization",
    },
};
