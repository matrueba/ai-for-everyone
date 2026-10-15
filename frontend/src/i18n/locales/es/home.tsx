import type { PageId } from "../../content-types";

export const home = {
    eyebrow: "Aprende IA explorando",
    title: "AI for Everyone",
    subtitle:
        "Un recorrido interactivo por el funcionamiento interno de la IA moderna: desde los primeros modelos hasta los Transformers. Visualiza, experimenta y entiende cada pieza.",

    actions: {
        start: "Empezar el recorrido",
        visualizer: "Ir al Visualizador de Atención",
    },

    path: {
        heading: "El recorrido",
        lead: "Siete paradas, de los conceptos básicos a la atención de un Transformer. Puedes seguirlas en orden o saltar a la que te interese.",
    },

    /** One line per stop of the learning path, shown on its card. */
    sections: {
        history: "Ocho décadas de ideas, inviernos y avances que nos trajeron hasta los LLM.",
        train: "Qué significa que un modelo «aprenda»: datos, predicciones, error y ajuste.",
        "gradient-descent": "Mira cómo el algoritmo baja por la superficie de coste hasta el mínimo.",
        inference: "Usa modelos ya entrenados para predecir valores y clasificar en tiempo real.",
        evaluation: "Cómo medir si un modelo funciona bien con datos que nunca ha visto.",
        "neural-network": "Arrastra un punto y observa qué neuronas se encienden en una red real.",
        visualizer: "Inspecciona cómo los tokens se atienden entre sí, capa a capa y cabeza a cabeza.",
    } satisfies Record<Exclude<PageId, "home">, string>,

    comingSoon: "Próximamente",
};
