export const gradient = {
    page: {
        title: "Descenso del Gradiente",
        subtitle:
            "Explora cómo aprenden los distintos modelos minimizando sus funciones de coste con el algoritmo de optimización del Descenso del Gradiente.",
        tabTheory: "Teoría",
        tabLinear: "Regresión Lineal",
        tabLogistic: "Regresión Logística",
    },

    theory: {
        optimization: {
            heading: "Entrenamiento y Optimización",
            p1: (
                <>
                    Tal como se explicó en la sección de entrenamiento, el objetivo principal al entrenar un modelo de
                    Inteligencia Artificial es <strong>optimizar sus parámetros</strong>. De esta forma, podemos evaluar
                    qué tan bien se ajusta a nuestros datos y garantizar que sus predicciones sean precisas cuando se
                    enfrente a nueva información.
                </>
            ),
            p2: (
                <>
                    Para lograr esto, utilizamos el algoritmo conocido como{" "}
                    <strong>Descenso del Gradiente (Gradient Descent)</strong>, el motor de optimización fundamental en
                    el que se basan los modelos modernos de Inteligencia Artificial.
                </>
            ),
        },

        cost: {
            heading: "La Función de Coste",
            p1: (
                <>
                    El primer paso de este proceso es definir la <strong>función de coste</strong>. Esta expresión
                    matemática calcula el error que comete el modelo al intentar predecir el valor de salida a partir de
                    los datos de entrada.
                </>
            ),
            p2: (
                <>
                    Evidentemente, nuestro objetivo es que las predicciones sean lo más exactas posibles; es decir, el
                    algoritmo buscará siempre <strong>minimizar esta función de error</strong>. Existen diferentes
                    funciones para calcular este error dependiendo del tipo de problema:
                </>
            ),
            mse: {
                title: "Error Cuadrático Medio (MSE)",
                body: "Utilizado principalmente para problemas de predicción de valores continuos (Regresión).",
            },
            crossEntropy: {
                title: "Entropía Cruzada (Log Loss)",
                body: "Usada cuando el objetivo es predecir categorías o clases (Clasificación).",
            },
        },

        analogy: {
            heading: "La Analogía del Descenso",
            p1: (
                <>
                    Si lo trasladamos al terreno matemático, buscamos que el error alcance un{" "}
                    <strong>mínimo global</strong> dentro de un espacio multidimensional.
                </>
            ),
            mathAlt: "Representación matemática del descenso del gradiente",
            lead: "Para entenderlo, hagamos una analogía visual:",
            quote: "«Imagina que te encuentras en una expedición en lo alto de una cadena montañosa envuelta en una densa niebla. Tu objetivo es llegar al punto de menor altitud donde se encuentra el campamento base. Como no puedes ver a tu alrededor, usas tus pies para sentir la inclinación del terreno y das un paso en la dirección que tiene la pendiente más pronunciada hacia abajo.»",
            descentAlt: "Animación del descenso del gradiente",
            descentCaption:
                "Representación visual del descenso por la superficie de error hacia el mínimo global",
            p2: (
                <>
                    Sin embargo, esta analogía también ilustra uno de los mayores desafíos del algoritmo:{" "}
                    <strong>los mínimos locales</strong>. Al estar rodeado de niebla, el modelo no tiene una visión
                    global del paisaje. Podría ocurrir que desciendas hasta el fondo de un valle pequeño creyendo que
                    has llegado al punto más bajo posible, sin darte cuenta de que existe un valle mucho más profundo
                    (el mínimo global).
                </>
            ),
            p3: (
                <>
                    Si el algoritmo llega a un valle donde el terreno vuelve a subir en todas direcciones, se detendrá.
                    Gran parte de la complejidad en el diseño del modelo consiste precisamente en tratar de escapar de
                    estos mínimos locales engañosos para encontrar el verdadero mínimo global. Aquí entran en juego los{" "}
                    <strong>hiperparámetros</strong> que iremos conociendo a lo largo de este viaje.
                </>
            ),
        },

        math: {
            heading: "La Matemática de la Exploración",
            p1: (
                <>
                    Aquí entra en juego el concepto de <strong>gradiente</strong>, que se define como la dirección de
                    máximo crecimiento de una función. Por lógica, si tomamos la dirección opuesta, nos moveremos en la
                    dirección de máximo descenso.
                </>
            ),
            terms: {
                weights: (
                    <>
                        <strong>Parámetros:</strong> Los pesos del modelo que estamos optimizando.
                    </>
                ),
                gradient: (
                    <>
                        <strong>Gradiente:</strong> Indica la dirección y la inclinación de la pendiente en nuestro
                        punto actual.
                    </>
                ),
                learningRate: (
                    <>
                        <strong>Tasa de Aprendizaje (Learning Rate):</strong> Controla el tamaño de los pasos. Si es muy
                        grande, podríamos saltarnos el fondo del valle; si es muy pequeño, el aprendizaje será
                        extremadamente lento.
                    </>
                ),
            },
        },

        cta: (
            <>
                En las pestañas de <strong>Regresión Lineal</strong> y <strong>Regresión Logística</strong> podrás
                conocer con mayor profundidad cómo se aplica el algoritmo a cada tipo de problema.
            </>
        ),
    },

    controls: {
        start: "Iniciar entrenamiento",
        pause: "Pausar",
        reset: "Reiniciar",
        learningRate: "LR:",
        iteration: "Iteración",
    },

    linear: {
        title: "Regresión Lineal",
        subtitle: "Predice valores continuos ajustando una recta o un plano.",
        loading: "Cargando regresión lineal…",
        mode2d: "Ejemplo 1 (2D)",
        mode3d: "Precio Vivienda (3D)",

        heading: "Fundamentos de la Regresión Lineal",
        p1: (
            <>
                Cuando nos enfrentamos a un problema donde el objetivo es predecir un{" "}
                <strong>valor numérico continuo</strong> (como un precio, un salario o una distancia), el modelo más
                sencillo es la Regresión Lineal.
            </>
        ),
        scenario: {
            title: "Escenario de Ejemplo: Predicción de Vivienda",
            lead: (
                <>
                    Queremos predecir el valor (<strong>y</strong>) de una vivienda basándonos en dos características
                    principales:
                </>
            ),
            bullets: {
                1: (
                    <>
                        El tamaño en metros cuadrados (<strong>X₁</strong>).
                    </>
                ),
                2: (
                    <>
                        Una nota del 1 al 10 que evalúa su localización (<strong>X₂</strong>).
                    </>
                ),
            },
        },
        p2: (
            <>
                Para que la IA aprenda, partimos de un conjunto de datos que contiene múltiples ejemplos de viviendas
                donde ya conocemos tanto sus características como su precio real. El algoritmo de{" "}
                <strong>Descenso del Gradiente</strong> descubrirá los patrones entre estos datos.
            </>
        ),
        modelHeading: "El Modelo Matemático",
        modelLead: "Al ser una regresión lineal, la función que define nuestro modelo es una ecuación lineal con la siguiente estructura:",
        legend: {
            y: (
                <>
                    <strong>y:</strong> Predicción del modelo (precio estimado).
                </>
            ),
            x: (
                <>
                    <strong>X₁ / X₂:</strong> Variables de entrada.
                </>
            ),
            w: (
                <>
                    <strong>W₁ / W₂:</strong> Parámetros o importancia de cada
                    característica.
                </>
            ),
            b: (
                <>
                    <strong>b:</strong> Parámetro de ajuste base o sesgo (Bias).
                </>
            ),
        },
        realtimeHeading: "Optimización en Tiempo Real",
        realtimeBody: (
            <>
                El objetivo es que el Descenso del Gradiente ajuste automáticamente los valores de <strong>W</strong> y{" "}
                <strong>b</strong> hasta encontrar aquellos que minimicen el error. En el Playground interactivo, podrás
                ver cómo esta función se mueve y se ajusta a los datos.
            </>
        ),
        lrBox: {
            title: "Explora la importancia de la Tasa de Aprendizaje (LR)",
            tooLowLabel: "Si la tasa es demasiado baja:",
            tooLowBody:
                "El algoritmo dará pasos minúsculos. Necesitará miles de iteraciones y el entrenamiento será excesivamente lento.",
            tooHighLabel: "Si la tasa es demasiado alta:",
            tooHighBody:
                "El algoritmo dará pasos erráticos y «rebotará» de un lado a otro, impidiendo que alcance el mínimo global.",
        },
    },

    logistic: {
        title: "Regresión Logística",
        subtitle: "Clasifica los datos en categorías usando la función sigmoide.",
        loading: "Cargando regresión logística…",
        mode2d: "Ejemplo 1 (2D)",
        mode3d: "Probabilidad Admisión (3D)",

        heading: "Fundamentos de la Regresión Logística",
        p1: (
            <>
                Cuando el objetivo es predecir una <strong>categoría o clase binaria</strong> (como Sí/No, Spam/No Spam
                o Admitido/Rechazado) en lugar de un número continuo, recurrimos a la Regresión Logística.
            </>
        ),
        scenario: {
            title: "Escenario de Ejemplo: Admisión Universitaria",
            lead: (
                <>
                    Queremos predecir la probabilidad de que un estudiante sea admitido (<strong>y = 1</strong> o{" "}
                    <strong>0</strong>) basándonos en dos características principales:
                </>
            ),
            bullets: {
                1: (
                    <>
                        Las horas semanales de estudio (<strong>X₁</strong>).
                    </>
                ),
                2: (
                    <>
                        La puntuación en el examen de ingreso (<strong>X₂</strong>).
                    </>
                ),
            },
        },
        p2: (
            <>
                A diferencia de la regresión lineal, no podemos simplemente trazar una línea recta que se ajuste a los
                datos. Debemos aplicar funciones no lineales que transformen el resultado, acotándolo entre{" "}
                <strong>0 y 1</strong> (0 % y 100 %). La función típica usada para este propósito es la función{" "}
                <strong>sigmoide</strong>. Posteriormente, conoceremos otras funciones no lineales utilizadas en
                problemas de clasificación, como la tangente hiperbólica.
            </>
        ),
        sigmoidAlt: "Función sigmoide",
        sigmoidCaption: "La función sigmoide transforma cualquier valor real en un valor acotado entre 0 y 1.",
        modelHeading: "El Modelo Matemático",
        modelLead:
            "La salida del modelo se calcula pasando la combinación lineal de las características a través de la función sigmoide:",
        legend: {
            y: (
                <>
                    <strong>y:</strong> Probabilidad predicha (entre 0 y 1) de
                    admisión.
                </>
            ),
            z: (
                <>
                    <strong>z:</strong> Combinación lineal de las características.
                </>
            ),
            x: (
                <>
                    <strong>X₁ / X₂:</strong> Variables de entrada (horas y examen).
                </>
            ),
            w: (
                <>
                    <strong>W₁ / W₂ / b:</strong> Pesos y sesgo que determinan la
                    frontera de decisión.
                </>
            ),
            sigma: (
                <>
                    <strong>σ():</strong> Función sigmoide.
                </>
            ),
        },
        borderHeading: "La Función Sigmoide y la Frontera",
        borderBody: (
            <>
                La función sigmoide aplasta cualquier valor real en el intervalo (0, 1). Si <strong>y ≥ 0,5</strong>,
                clasificamos la predicción como clase 1 (Admitido); si es menor, como clase 0. El lugar geométrico donde
                la probabilidad es exactamente 0,5 (es decir, z = 0) se conoce como la{" "}
                <strong>frontera de decisión</strong>.
            </>
        ),
        lossBox: {
            title: "La Función de Pérdida: Entropía Cruzada",
            body: (
                <>
                    En regresión logística no usamos el Error Cuadrático Medio, sino la{" "}
                    <strong>Entropía Cruzada Binaria (Log Loss)</strong>. Esta función penaliza fuertemente a los
                    errores cometidos con alta confianza. Por ejemplo, predecir una probabilidad de 0,01 cuando la clase
                    real es 1 genera una penalización exponencialmente grande.
                </>
            ),
        },
    },

    plots: {
        regression2d: {
            title: "Ajuste del Modelo",
            xLabel: "Característica (X)",
            yLabel: "Objetivo (y)",
        },
        regression3d: {
            title: "Predicción de Precio de Vivienda",
            subtitle: "Plano de regresión sobre m² y ubicación (Datos Normalizados)",
            iteration: "Iteración",
            cost: "Coste",
            xLabel: "Tamaño",
            yLabel: "Ubicación",
            zLabel: "Precio",
            dataName: "Viviendas (datos de entrenamiento)",
            planeName: "Plano de regresión",
            fitted: "Función ajustada",
            formulaVars: { price: "precio", area: "m²", location: "ubicación" },
        },
        cost: {
            titles: {
                "1d": "Función de Coste (1D)",
                "2d": "Reducción del Error (2D)",
                mse: "Reducción del Error (MSE)",
            },
            subtitles: {
                "1d": "Minimización de pérdida sobre w",
                "2d": "Camino de optimización sobre w y b",
                mse: "Minimización de pérdida en el tiempo",
            },
            axisWeight: "Peso (w)",
            axisBias: "Sesgo (b)",
            axisIteration: "Iteración",
            axisCostMse: "Coste (MSE)",
            axisCostJ: "Coste J(w)",
            searching: "Buscando el mínimo global…",
            currentCost: "Coste actual:",
        },
        backprop3d: {
            title: "Optimización del Espacio de Parámetros",
            subtitle: "Descenso del gradiente · escala log(1+coste)",
            pathName: "Camino de optimización",
            currentName: "Posición actual",
            axisCost: "Coste",
            statW1: "W₁ (horas estudio)",
            statW2: "W₂ (nota examen)",
            statCost: "Coste (Log Loss)",
        },
        logistic2d: {
            title: "Frontera de Clasificación del Modelo",
            xLabel: "Característica (X)",
            yLabel: "Probabilidad (P(y=1))",
            iteration: "Iteración:",
            logLoss: "Log Loss:",
        },
        logistic3d: {
            title: "Predicción de Admisión 3D",
            subtitle: "Probabilidad de ser admitido (Sí/No)",
            iteration: "Iteración:",
            logLoss: "Log Loss:",
            studentsName: "Estudiantes",
            surfaceName: "Probabilidad (Sigmoide)",
            xLabel: "Horas Estudio (x₁)",
            yLabel: "Examen Ingreso (x₂)",
            zLabel: "Prob. Admisión P(y=1)",
            footerLabel: "Función Probabilidad Admisión",
            formulaVars: { hours: "horas", score: "nota" },
        },
    },
};
