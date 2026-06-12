import React from 'react';

interface TrainProps {
    setActivePage?: (page: string) => void;
}

const Train: React.FC<TrainProps> = ({ setActivePage }) => {
    const LinkToGradientDescent = ({ children }: { children: React.ReactNode }) => {
        if (setActivePage) {
            return (
                <button
                    onClick={() => setActivePage('gradient-descent')}
                    className="text-accent-indigo hover:text-accent-indigo/80 font-bold underline transition-colors cursor-pointer inline-flex items-center gap-0.5"
                >
                    {children}
                </button>
            );
        }
        return <strong className="text-accent-indigo font-bold">{children}</strong>;
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-y-auto custom-scrollbar pb-12">
            {/* Header */}
            <header className="flex flex-row items-center gap-6 overflow-hidden shrink-0 p-8 border-b border-slate-200 bg-white">
                <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold text-slate-900 tracking-tighter shrink-0">
                    Entrenamiento de Modelos
                </h1>
                <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block"></div>
                <p className="text-[clamp(0.75rem,1.5vw,1.1rem)] text-slate-500 font-medium italic leading-tight max-w-[50%]">
                    ¿Cómo aprenden realmente los modelos a resolver problemas a partir de los datos?
                </p>
            </header>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-8 mt-8 space-y-12 w-full">

                {/* Introduction Section */}
                <section className="card-elevated p-8">
                    <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-base leading-relaxed">
                        <p>
                            En Inteligencia Artificial (IA), el <strong>entrenamiento</strong> es el proceso mediante el cual un modelo aprende a resolver problemas a partir de datos, sin necesidad de que un humano programe explícitamente las reglas para hacerlo.
                        </p>
                        <p>
                            Durante este proceso, el algoritmo encuentra patrones y relaciones fundamentales entre los datos para construir un <strong>modelo matemático interno</strong> que caracteriza el comportamiento de esta información. De esta forma, el modelo es capaz de proporcionar soluciones cuando se enfrenta a nuevos datos que nunca antes había visto.
                        </p>
                    </div>
                </section>

                {/* Fundamental Elements Section */}
                <section className="card-elevated p-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">1</span>
                        Elementos Fundamentales
                    </h2>

                    <div className="space-y-8 text-slate-600">
                        <p className="text-base">
                            En el proceso de entrenamiento intervienen tres elementos fundamentales:
                        </p>

                        <div className="space-y-6">
                            {/* Element 1: Set de Entrenamiento */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">A</span>
                                    Set de entrenamiento
                                </h3>
                                <p className="text-sm leading-relaxed mb-4">
                                    Es la información básica a partir de la cual aprende el modelo. Para que el aprendizaje sea efectivo, es fundamental que los datos estén correctamente estructurados, limpios y sean fiables. Denominamos <strong>registro</strong> a cada uno de los elementos individuales del set. Generalmente, los datos se estructuran en formato tabla (que internamente se procesarán como matrices numéricas). Cada fila representa un registro y cada columna representa una característica de los datos.
                                </p>

                                <div className="mt-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Ejemplo: Predicción del valor de una vivienda
                                    </p>
                                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                                        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">Metros Cuadrados</th>
                                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">Habitaciones</th>
                                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500">¿Tiene Ascensor?</th>
                                                    <th className="px-4 py-2.5 text-left font-bold text-indigo-600 bg-indigo-50/50">Precio (Salida Esperada)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                <tr>
                                                    <td className="px-4 py-2.5">85 m²</td>
                                                    <td className="px-4 py-2.5">2</td>
                                                    <td className="px-4 py-2.5">Sí</td>
                                                    <td className="px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-50/30">250.000 €</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2.5">120 m²</td>
                                                    <td className="px-4 py-2.5">3</td>
                                                    <td className="px-4 py-2.5">No</td>
                                                    <td className="px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-50/30">310.000 €</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2.5">60 m²</td>
                                                    <td className="px-4 py-2.5">1</td>
                                                    <td className="px-4 py-2.5">Sí</td>
                                                    <td className="px-4 py-2.5 font-semibold text-indigo-600 bg-indigo-50/30">180.000 €</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Element 2: Salida Esperada */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">B</span>
                                    Salida esperada
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    Para que el entrenamiento sea efectivo, es necesario proporcionar al algoritmo el resultado real de cada uno de los registros (en nuestra tabla anterior, la columna <strong>«Precio»</strong>). Esta es la «columna de respuestas» contra la que el modelo se evaluará para saber cuánto se ha equivocado al ejecutar su predicción.
                                </p>
                            </div>

                            {/* Element 3: Algoritmo */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">C</span>
                                    Algoritmo
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    Como veremos en la sección de <LinkToGradientDescent>Gradient Descent</LinkToGradientDescent>, en IA existen multitud de algoritmos dependiendo del problema a resolver, siendo las redes neuronales las grandes protagonistas actuales. El algoritmo es la estructura matemática subyacente donde sucede la magia: proporciona al modelo las herramientas y las reglas básicas para poder aprender de los datos.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step-by-Step Cycle Section */}
                <section className="card-elevated p-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">2</span>
                        El Ciclo de Entrenamiento Paso a Paso
                    </h2>
                    <p className="text-slate-500 mb-8 italic text-sm">
                        A continuación, veremos los pasos de ejecución de este ciclo:
                    </p>
                    <div className="space-y-12">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                1
                            </div>
                            <div className="text-slate-600">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Entrada de datos en lotes (Batches)</h4>
                                <p className="text-sm leading-relaxed">
                                    Se introducen los datos en el algoritmo. Generalmente, por razones de coste computacional, el set de entrenamiento se divide en pequeños lotes. Internamente, el algoritmo ejecuta multiplicaciones matemáticas enormes que consumen mucha memoria y procesador (si quieres conocer más sobre las matemáticas detrás de esto, ve a la sección de <LinkToGradientDescent>Gradient Descent</LinkToGradientDescent>), por lo que es más eficiente crear pequeños fragmentos que se introducen secuencialmente. Cuando el algoritmo ha procesado todos y cada uno de los lotes hasta completar el set de datos entero, decimos que ha completado una <strong>«época» (epoch)</strong>.
                                </p>

                                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white max-w-2xl">
                                    <img
                                        src="/step1_batches.png"
                                        alt="Dataset Batching infographic"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100">
                                        Infographic: Dataset Batching & Splitting Process
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                2
                            </div>
                            <div className="text-slate-600">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Predicción inicial (Adivinar)</h4>
                                <p className="text-sm leading-relaxed">
                                    El algoritmo procesa los datos que recibe para intentar predecir el resultado final. En este primer paso, como el modelo no sabe nada todavía y sus configuraciones son aleatorias, su predicción será un intento a ciegas, como una suposición al azar.
                                </p>

                                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white max-w-2xl">
                                    <img
                                        src="/step2_forward.png"
                                        alt="Forward Pass / Initial Prediction infographic"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100">
                                        Infographic: Forward Pass & Initial Output Prediction
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                3
                            </div>
                            <div className="text-slate-600">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Cálculo del error (Medir)</h4>
                                <p className="text-sm leading-relaxed">
                                    Comparamos el resultado que el modelo ha predicho con el resultado real (la salida esperada) para saber exactamente cuánto se ha equivocado. Esta diferencia es el "error" o "pérdida" (loss).
                                </p>

                                {/* Analogy Alert Box */}
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 my-4 text-sm leading-relaxed text-indigo-900 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200/20 rounded-bl-full -z-10"></div>
                                    <p className="font-semibold mb-2 flex items-center gap-2">
                                        <span>📏</span> La Analogía de la Diana
                                    </p>
                                    <p className="italic">
                                        "Una vez que el dardo ha caído, nos acercamos y medimos la distancia que hay entre el dardo lanzado (nuestra predicción) y el centro de la diana (el resultado correcto). Esa distancia representa el error: cuanto más lejos esté, mayor es el valor del error que debemos corregir para la próxima tirada."
                                    </p>
                                </div>

                                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white max-w-2xl">
                                    <img
                                        src="/step3_loss.png"
                                        alt="Loss Calculation infographic"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100">
                                        Infographic: Loss Function Comparison & Error Scoring
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                4
                            </div>
                            <div className="text-slate-600">
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Ajuste de parámetros (Ajustar / Optimizar)</h4>
                                <p className="text-sm leading-relaxed mb-4">
                                    A partir del error medido, el modelo ajusta sus parámetros internos (los mandos o configuraciones) para que en el siguiente intento el error sea menor. En las primeras vueltas, el error será alto, pero a medida que el proceso se repite, los parámetros se van afinando para que la predicción se acerque cada vez más a la salida real.
                                </p>

                                {/* Analogy Alert Box */}
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 my-4 text-sm leading-relaxed text-indigo-900 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200/20 rounded-bl-full -z-10"></div>
                                    <p className="font-semibold mb-2 flex items-center gap-2">
                                        <span>🎛️</span> La Analogía de la Mesa de Mezclas
                                    </p>
                                    <p className="italic">
                                        "Puedes imaginar estos parámetros como los controles en la mesa de mezclas de un estudio de grabación. Al principio del entrenamiento, los mandos están colocados al azar y la música suena fatal (el error es muy alto). A medida que el proceso de optimización hace su trabajo, va moviendo sutilmente cada mando hacia arriba o hacia abajo. Tras cada iteración, los mandos están mejor configurados y la «música» (la predicción) se acerca más al resultado perfecto."
                                    </p>
                                </div>

                                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white max-w-2xl">
                                    <img
                                        src="/step4_optimization.png"
                                        alt="Optimization and Parameter Update infographic"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100">
                                        Infographic: Optimization & Parameter Updates via Gradient Descent
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-slate-600 text-base leading-relaxed">
                        <p>
                            Este proceso se repite iterativamente un número determinado de épocas hasta que el modelo <strong>«deja de aprender»</strong>; es decir, cuando el error cometido entre la predicción y la realidad ya no se reduce, o su reducción es insignificante. En ese momento, se establece que el modelo ha finalizado su entrenamiento.
                        </p>
                    </div>
                </section>



                {/* CTA / Footer */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl text-center">
                    <h3 className="text-xl font-bold mb-2">¡Pon a prueba el aprendizaje del modelo!</h3>
                    <p className="text-sm opacity-90 max-w-2xl mx-auto">
                        Ve a la sección de <LinkToGradientDescent>Gradient Descent</LinkToGradientDescent> para explorar a fondo los algoritmos y el proceso de entrenamiento.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Train;
