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

    nav: {
        label: "Navegación principal",
        groups: {
            fundamentals: "Fundamentos",
            networks: "Redes neuronales y LLMs",
        },
        openMenu: "Abrir menú",
        closeMenu: "Cerrar menú",
        next: "Siguiente paso",
    },

    sidebar: {
        status: "Estado",
        backendOnline: "Backend conectado",
        backendOffline: "Backend no disponible",
        backendChecking: "Comprobando backend…",
    },

    chart3d: {
        resetView: "Volver a la vista inicial",
        dragHint: "Arrastra para girar · rueda para acercar",
        costLow: "coste bajo",
        costHigh: "coste alto",
        start: "Inicio",
        nextStep: "Siguiente paso (−∇)",
        residuals: "Errores (residuos)",
        boundary: "Frontera p = 0,5",
    },

    theme: {
        label: "Tema",
        light: "Claro",
        dark: "Oscuro",
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
