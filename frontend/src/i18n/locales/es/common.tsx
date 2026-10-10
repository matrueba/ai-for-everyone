import type { MenuLabels } from "../../content-types";

export const common = {
    appName: "AI for Everyone",

    menu: {
        home: "Inicio",
        history: "Historia de la IA",
        train: "Entrenamiento",
        "gradient-descent": "Descenso del Gradiente",
        inference: "Inferencia",
        "neural-network": "Neuronas en Acción",
        evaluation: "Evaluación",
        visualizer: "Visualizador de Atención",
    } satisfies MenuLabels,

    sidebar: {
        status: "Estado",
        backendOnline: "Backend conectado",
    },

    language: {
        label: "Idioma",
        es: "Español",
        en: "English",
        switchTo: "Cambiar a español",
    },

    footer: {
        copyright: "© 2026 AI for Everyone",
        github: "Código en GitHub",
    },

    actions: {
        retry: "Reintentar",
        reset: "Reiniciar",
        play: "Iniciar entrenamiento",
        pause: "Pausar",
    },

    labels: {
        iteration: "Iteración",
        cost: "Coste",
        logLoss: "Log Loss",
        learningRate: "LR",
    },

    states: {
        loading: "Cargando…",
        noData: "No hay datos disponibles",
        noData3d: "No hay datos disponibles para la visualización 3D",
    },
};
