import { PageLink } from "../../../navigation";

export const train = {
    header: {
        title: "Entrenamiento de Modelos",
        subtitle: "¿Cómo aprenden realmente los modelos a resolver problemas a partir de los datos?",
    },

    intro: {
        p1: (
            <>
                En Inteligencia Artificial (IA), el <strong>entrenamiento</strong> es el proceso mediante el cual un
                modelo aprende a resolver problemas a partir de datos, sin necesidad de que un humano programe
                explícitamente las reglas para hacerlo.
            </>
        ),
        p2: (
            <>
                Durante este proceso, el algoritmo encuentra patrones y relaciones fundamentales entre los datos para
                construir un <strong>modelo matemático interno</strong> que caracteriza el comportamiento de esta
                información. De esta forma, el modelo es capaz de proporcionar soluciones cuando se enfrenta a nuevos
                datos que nunca antes había visto.
            </>
        ),
    },

    elements: {
        heading: "Elementos Fundamentales",
        lead: "En el proceso de entrenamiento intervienen tres elementos fundamentales:",

        dataset: {
            title: "Set de entrenamiento",
            body: (
                <>
                    Es la información básica a partir de la cual aprende el modelo. Para que el aprendizaje sea
                    efectivo, es fundamental que los datos estén correctamente estructurados, limpios y sean fiables.
                    Denominamos <strong>registro</strong> a cada uno de los elementos individuales del set.
                    Generalmente, los datos se estructuran en formato tabla (que internamente se procesarán como
                    matrices numéricas). Cada fila representa un registro y cada columna representa una característica
                    de los datos.
                </>
            ),
            exampleLabel: "Ejemplo: Predicción del valor de una vivienda",
            table: {
                headers: {
                    area: "Metros Cuadrados",
                    rooms: "Habitaciones",
                    elevator: "¿Tiene Ascensor?",
                    price: "Precio (Salida Esperada)",
                },
                rows: [
                    { area: "85 m²", rooms: "2", elevator: "Sí", price: "250.000 €" },
                    { area: "120 m²", rooms: "3", elevator: "No", price: "310.000 €" },
                    { area: "60 m²", rooms: "1", elevator: "Sí", price: "180.000 €" },
                ],
            },
        },

        expected: {
            title: "Salida esperada",
            body: (
                <>
                    Para que el entrenamiento sea efectivo, es necesario proporcionar al algoritmo el resultado real de
                    cada uno de los registros (en nuestra tabla anterior, la columna <strong>«Precio»</strong>). Esta es
                    la «columna de respuestas» contra la que el modelo se evaluará para saber cuánto se ha equivocado al
                    ejecutar su predicción.
                </>
            ),
        },

        algorithm: {
            title: "Algoritmo",
            body: (
                <>
                    Como veremos en la sección de{" "}
                    <PageLink to="gradient-descent">Descenso del Gradiente</PageLink>, en IA existen multitud de
                    algoritmos dependiendo del problema a resolver, siendo las redes neuronales las grandes
                    protagonistas actuales. El algoritmo es la estructura matemática subyacente donde sucede la magia:
                    proporciona al modelo las herramientas y las reglas básicas para poder aprender de los datos.
                </>
            ),
        },
    },

    cycle: {
        heading: "El Ciclo de Entrenamiento Paso a Paso",
        lead: "A continuación, veremos los pasos de ejecución de este ciclo:",

        steps: {
            1: {
                title: "Entrada de datos en lotes (Batches)",
                body: (
                    <>
                        Se introducen los datos en el algoritmo. Generalmente, por razones de coste computacional, el
                        set de entrenamiento se divide en pequeños lotes. Internamente, el algoritmo ejecuta
                        multiplicaciones matemáticas enormes que consumen mucha memoria y procesador (si quieres conocer
                        más sobre las matemáticas detrás de esto, ve a la sección de{" "}
                        <PageLink to="gradient-descent">Descenso del Gradiente</PageLink>), por lo que es más eficiente
                        crear pequeños fragmentos que se introducen secuencialmente. Cuando el algoritmo ha procesado
                        todos y cada uno de los lotes hasta completar el set de datos entero, decimos que ha completado
                        una <strong>«época» (epoch)</strong>.
                    </>
                ),
                imageAlt: "Infografía del troceado del dataset en lotes",
                caption: "Infografía: proceso de división y troceado del dataset",
            },
            2: {
                title: "Predicción inicial (Adivinar)",
                body: (
                    <>
                        El algoritmo procesa los datos que recibe para intentar predecir el resultado final. En este
                        primer paso, como el modelo no sabe nada todavía y sus configuraciones son aleatorias, su
                        predicción será un intento a ciegas, como una suposición al azar.
                    </>
                ),
                imageAlt: "Infografía de la pasada hacia delante y la predicción inicial",
                caption: "Infografía: pasada hacia delante y predicción inicial de la salida",
            },
            3: {
                title: "Cálculo del error (Medir)",
                body: (
                    <>
                        Comparamos el resultado que el modelo ha predicho con el resultado real (la salida esperada)
                        para saber exactamente cuánto se ha equivocado. Esta diferencia es el «error» o «pérdida»
                        (loss).
                    </>
                ),
                imageAlt: "Infografía del cálculo de la pérdida",
                caption: "Infografía: comparación mediante la función de pérdida y puntuación del error",
            },
            4: {
                title: "Ajuste de parámetros (Ajustar / Optimizar)",
                body: (
                    <>
                        A partir del error medido, el modelo ajusta sus parámetros internos (los mandos o
                        configuraciones) para que en el siguiente intento el error sea menor. En las primeras vueltas,
                        el error será alto, pero a medida que el proceso se repite, los parámetros se van afinando para
                        que la predicción se acerque cada vez más a la salida real.
                    </>
                ),
                imageAlt: "Infografía de la optimización y actualización de parámetros",
                caption: "Infografía: optimización y actualización de parámetros con el descenso del gradiente",
            },
        },

        analogies: {
            dartboard: {
                title: "La Analogía de la Diana",
                body: "«Una vez que el dardo ha caído, nos acercamos y medimos la distancia que hay entre el dardo lanzado (nuestra predicción) y el centro de la diana (el resultado correcto). Esa distancia representa el error: cuanto más lejos esté, mayor es el valor del error que debemos corregir para la próxima tirada.»",
            },
            mixer: {
                title: "La Analogía de la Mesa de Mezclas",
                body: "«Puedes imaginar estos parámetros como los controles en la mesa de mezclas de un estudio de grabación. Al principio del entrenamiento, los mandos están colocados al azar y la música suena fatal (el error es muy alto). A medida que el proceso de optimización hace su trabajo, va moviendo sutilmente cada mando hacia arriba o hacia abajo. Tras cada iteración, los mandos están mejor configurados y la «música» (la predicción) se acerca más al resultado perfecto.»",
            },
        },

        outro: (
            <>
                Este proceso se repite iterativamente un número determinado de épocas hasta que el modelo{" "}
                <strong>«deja de aprender»</strong>; es decir, cuando el error cometido entre la predicción y la
                realidad ya no se reduce, o su reducción es insignificante. En ese momento, se establece que el modelo
                ha finalizado su entrenamiento.
            </>
        ),
    },

    cta: {
        title: "¡Pon a prueba el aprendizaje del modelo!",
        body: (
            <>
                Ve a la sección de <PageLink to="gradient-descent">Descenso del Gradiente</PageLink> para explorar a
                fondo los algoritmos y el proceso de entrenamiento.
            </>
        ),
    },
};
