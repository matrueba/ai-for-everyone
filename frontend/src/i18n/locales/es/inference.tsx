import type { InferenceScenarios } from "../../content-types";

export const inference = {
    title: "Inferencia",
    subtitle: "Aprende cómo los modelos generan predicciones en tiempo real.",

    intro: (
        <>
            Una vez finalizado el entrenamiento el modelo está preparado para ejecutar predicciones con nuevos datos. A
            este proceso se le denomina <strong>inferencia</strong>. En el playground puedes visualizar cómo los modelos
            entrenados usan sus parámetros para generar predicciones en tiempo real en problemas de{" "}
            <strong>regresión</strong> (predicción de valores continuos) y <strong>clasificación</strong> (predicción de
            categorías).
        </>
    ),

    params: {
        heading: "Parámetros",
    },

    brain: {
        heading: "Inteligencia",
        equation: "Ecuación Aprendida",
        result: "Resultado (Inferencia)",
    },

    plot: {
        dataName: "Datos",
        modelName: "Modelo",
        projectionName: "Proyección",
        keyPointsName: "Puntos Clave",
        inputTooltip: "Entrada",
        predictionTooltip: "Predicción",
    },

    loading: (scenario: string) => `Entrenando modelo para ${scenario}…`,
    loadingHint: "Optimizando pesos mediante Descenso del Gradiente",
    error: "Error al entrenar el modelo",
    retry: "Reintentar",

    scenarios: {
        generic: {
            tab: "Genérico",
            title: "Inferencia Genérica",
            description: "Mapeamos la entrada en dos dimensiones hacia el plano del modelo.",
            x1Label: "Característica 1 (X₁)",
            x2Label: "Característica 2 (X₂)",
            yLabel: "Objetivo (Y)",
        },
        houses: {
            tab: "Casas",
            title: "Precio de Viviendas",
            description: "Predicción del precio basada en metros cuadrados y puntuación de ubicación.",
            x1Label: "Superficie (m²)",
            x2Label: "Localización (0-10)",
            yLabel: "Precio (€)",
        },
        admission: {
            tab: "Admisión",
            title: "Clasificación de Admisión",
            description:
                "Predice la probabilidad de admisión universitaria basada en la calificación del examen y horas de actividades.",
            x1Label: "Calificación Examen",
            x2Label: "Actividades (h/semana)",
            yLabel: "Prob. Admisión",
        },
    } satisfies InferenceScenarios,
};
