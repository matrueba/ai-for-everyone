export const visualizer = {
    page: {
        title: "Visualizador de Atención",
        subtitle:
            "Explora el mecanismo central de la arquitectura Transformer a través de la teoría interactiva y la visualización en tiempo real.",
        tabTheory: "Teoría",
        tabPlayground: "Playground",
    },

    story: {
        heading: "La Historia del Transformer",
        sections: {
            1: {
                title: "El Problema Secuencial",
                body: (
                    <>
                        Antes de los Transformers, modelos como las RNN y las LSTM procesaban el texto palabra por
                        palabra, de izquierda a derecha. Esto era lento y tenía problemas para recordar lo que había
                        ocurrido mucho antes en una frase larga.
                    </>
                ),
            },
            2: {
                title: "Llega la Atención",
                body: (
                    <>
                        En 2017, un grupo de investigadores propuso «Attention is All You Need». En lugar de procesar
                        una palabra cada vez, el modelo mira <strong>todas las palabras simultáneamente</strong>.
                    </>
                ),
            },
            3: {
                title: "Self-Attention en Acción",
                body: (
                    <>
                        Cuando el modelo procesa la palabra «it» dentro de una frase, la self-attention le permite
                        asociarla con el sustantivo correcto mencionado antes, como «the store» o «the cat».
                    </>
                ),
            },
            4: {
                title: "Arquitectura Multi-Cabeza",
                body: (
                    <>
                        Al usar varias «cabezas», el modelo puede atender a distintos aspectos del texto al mismo
                        tiempo: una cabeza puede centrarse en la gramática mientras otra se ocupa de las relaciones
                        semánticas.
                    </>
                ),
            },
        },
        quote: "«La atención es el mecanismo que permite a un modelo ponderar la importancia de las distintas partes de los datos de entrada.»",
        footer: (
            <>
                Cambia a la <strong>pestaña Playground</strong> de arriba para ver los pesos de atención de tus propias
                frases.
            </>
        ),
    },

    playground: {
        inputLabel: "Frase de entrada",
        // The toy Transformer uses an English tokenizer (bert-base-uncased),
        // so the sample sentence stays in English in every locale.
        defaultSentence: "At the store, she bought apples, oranges, bananas,",
        placeholder: "Escribe una frase para analizar…",
        analyze: "Analizar",
        analyzing: "Analizando…",
        layer: "Capa",
        head: "Cabeza",
        viewLines: "Flujo",
        viewHeatmap: "Mapa de calor",
        viewMatrix: "Matriz",
        chips: {
            layers: "Capas",
            heads: "Cabezas",
        },
        runningForward: "Ejecutando la pasada hacia delante…",
        emptyTitle: "Listo para analizar",
        emptyBody: "Escribe una frase arriba para ver el Transformer en acción.",
        panelLines: "Flujo de Atención",
        panelHeatmap: "Mapa de Calor de Atención",
        panelMatrix: "Matriz Q / K",
        layerHead: (layer: number, head: number) => `Capa ${layer} · Cabeza ${head}`,
        tokensTitle: "Entrada Tokenizada",
        tokensCount: (n: number) => `${n} tokens`,
    },

    matrix: {
        tabVectors: "Vectores Q y K",
        tabProduct: "Matriz Q × Kᵀ",
        noData: "No hay datos de query/key para esta capa y esta cabeza.",
        matrixTitle: (name: string) => `Matriz ${name}`,
        selectedToken: (token: string, index: number) => (
            <>
                Token seleccionado: <strong className="tone-indigo">{token}</strong> (índice {index}) —
                haz clic en otra celda para cambiarlo
            </>
        ),
    },
};
