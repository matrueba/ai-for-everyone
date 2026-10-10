import type { NNStepCaptions } from "../../content-types";

export const neuralnet = {
    header: {
        title: "Neuronas en Acción",
        subtitle: "Observa cómo se activan las neuronas de una red neuronal real mientras hace una inferencia.",
    },

    connectionError: "No se pudo conectar con el backend. Arranca el servidor en el puerto 8000.",
    training: "Entrenando la red neuronal…",

    problem: (hiddenSize: number) => (
        <>
            Esta red neuronal (2 entradas → {hiddenSize} neuronas ocultas → 1 salida) ha sido entrenada para resolver un
            problema sencillo: decidir si un punto <span className="font-mono">(x₁, x₂)</span> está{" "}
            <strong className="text-indigo-600">dentro</strong> o <strong className="text-orange-600">fuera</strong> de
            un círculo. Un modelo lineal no puede resolverlo, pero una sola capa oculta sí.{" "}
            <strong>Arrastra el punto</strong> sobre el mapa (o usa los deslizadores) y observa qué neuronas se
            encienden y qué señal fluye por cada conexión.
        </>
    ),

    inputSpace: "Espacio de entrada",

    prediction: {
        heading: "Predicción",
        probabilityInside: "probabilidad de estar dentro",
        activeNeurons: "Neuronas ocultas activas:",
        accuracy: "Precisión de la red:",
    },

    graph: {
        heading: "La red por dentro",
        propagate: "▶ Propagar señal paso a paso",
        ariaLabel: "Grafo de la red neuronal",
        layers: {
            input: "Entrada",
            hidden: "Capa oculta · ReLU",
            output: "Salida · Sigmoide",
        },
        inactive: "inactiva",
        inside: "Dentro del círculo",
        outside: "Fuera del círculo",
        legend: {
            positive: "peso positivo",
            negative: "peso negativo",
            thickness: "grosor = magnitud del peso · brillo = señal que fluye",
            hint: "haz clic en una neurona para ver su cálculo",
        },
    },

    canvas: {
        ariaLabel: "Espacio de entrada: arrastra el punto para cambiar x1 y x2",
    },

    steps: {
        1: "1 · Los valores de entrada (x₁, x₂) llegan a las neuronas de la primera capa.",
        2: "2 · Cada conexión multiplica el valor por su peso w. Las líneas brillantes transportan más señal.",
        3: "3 · Cada neurona oculta suma sus entradas ponderadas más su sesgo, y aplica ReLU: si la suma es negativa, la neurona no se activa.",
        4: "4 · Las activaciones de las neuronas encendidas viajan hacia la capa de salida.",
        5: "5 · La función sigmoide convierte la suma final en una probabilidad entre 0 y 1.",
    } satisfies NNStepCaptions,

    inspector: {
        inputTitle: (index: number) => `Neurona de entrada x${index}`,
        inputBody:
            "Las neuronas de entrada no calculan nada: simplemente transmiten el valor de la característica hacia la capa oculta.",
        inputValue: "valor",

        hiddenTitle: (index: number) => `Neurona oculta #${index}`,
        hiddenBody: (
            <>
                Primero calcula la <strong>suma ponderada</strong> de sus entradas más el sesgo, y después aplica la
                función de activación <strong>ReLU</strong>: <span className="font-mono">max(0, z)</span>.
            </>
        ),
        hiddenInactive: " Como z es negativo, esta neurona no se activa (salida 0).",

        outputTitle: "Neurona de salida",
        outputBody: (
            <>
                Suma las activaciones de todas las neuronas ocultas (ponderadas por sus pesos) y aplica la{" "}
                <strong>sigmoide</strong> para obtener una probabilidad entre 0 y 1.
            </>
        ),
    },

    theory: {
        weighted: {
            title: "Suma ponderada",
            body: (
                <>
                    Cada neurona multiplica cada entrada por un <strong>peso</strong> (aprendido durante el
                    entrenamiento) y suma un <strong>sesgo</strong>. Los pesos positivos (líneas índigo) excitan a la
                    neurona; los negativos (líneas naranjas) la inhiben.
                </>
            ),
        },
        relu: {
            title: "Activación ReLU",
            body: (
                <>
                    La función <span className="font-mono">ReLU(z) = max(0, z)</span> decide si la neurona «se
                    enciende». Si la suma ponderada es negativa, la neurona queda <strong>inactiva</strong> y no aporta
                    nada. Esta no-linealidad es lo que permite a la red aprender fronteras curvas como el círculo.
                </>
            ),
        },
        concepts: {
            title: "De neuronas a conceptos",
            body: (
                <>
                    Cada neurona oculta aprende a detectar una «franja» del espacio de entrada. La capa de salida
                    combina esas detecciones simples para formar la frontera circular. Los LLMs funcionan con el mismo
                    principio, pero con <strong>miles de millones</strong> de neuronas.
                </>
            ),
        },
    },
};
