import React from 'react';

const TheoryContent: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-12 overflow-y-auto custom-scrollbar pb-12 pr-6">
            {/* Introduction Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">1</span>
                    Entrenamiento y Optimización
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                    <p>
                        Tal como se explicó en la sección de entrenamiento, el objetivo principal al entrenar un modelo de Inteligencia Artificial es <strong>optimizar sus parámetros</strong>. De esta forma, podemos evaluar qué tan bien se ajusta a nuestros datos y garantizar que sus predicciones sean precisas cuando se enfrente a nueva información.
                    </p>
                    <p>
                        Para lograr esto, utilizamos el algoritmo conocido como <strong>Descenso del Gradiente (Gradient Descent)</strong>, el motor de optimización fundamental en el que se basan los modelos modernos de Inteligencia Artificial.
                    </p>
                </div>
            </section>

            {/* Cost Function Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">2</span>
                    La Función de Coste
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                    <p>
                        El primer paso de este proceso es definir la <strong>función de coste</strong>. Esta expresión matemática calcula el error que comete el modelo al intentar predecir el valor de salida a partir de los datos de entrada.
                    </p>
                    <p>
                        Evidentemente, nuestro objetivo es que las predicciones sean lo más exactas posibles; es decir, el algoritmo buscará siempre <strong>minimizar esta función de error</strong>. Existen diferentes funciones para calcular este error dependiendo del tipo de problema:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Error Cuadrático Medio (MSE)</h3>
                                <p className="text-sm text-slate-600 mb-4">Utilizado principalmente para problemas de predicción de valores continuos (Regresión).</p>
                            </div>
                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center">
                                <code className="text-sm font-bold text-indigo-700">
                                    MSE = (1/n) Σ (y - ŷ)²
                                </code>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">Entropía Cruzada (Log Loss)</h3>
                                <p className="text-sm text-slate-600 mb-4">Usada cuando el objetivo es predecir categorías o clases (Clasificación).</p>
                            </div>
                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center">
                                <code className="text-xs font-bold text-indigo-700">
                                    L = -1/n Σ [y·log(ŷ) + (1-y)·log(1-ŷ)]
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analogy Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">3</span>
                    La Analogía del Descenso
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                    <p>
                        Si lo trasladamos al terreno matemático, buscamos que el error alcance un <strong>mínimo global</strong> dentro de un espacio multidimensional.
                    </p>
                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white">
                        <img
                            src="/gradient_descent_math.png"
                            alt="Mathematical representation of gradient descent"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <p>
                        Para entenderlo, hagamos una analogía visual:
                    </p>
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 italic">
                        "Imagina que te encuentras en una expedición en lo alto de una cadena montañosa envuelta en una densa niebla. Tu objetivo es llegar al punto de menor altitud donde se encuentra el campamento base. Como no puedes ver a tu alrededor, usas tus pies para sentir la inclinación del terreno y das un paso en la dirección que tiene la pendiente más pronunciada hacia abajo."
                    </div>

                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white">
                        <img
                            src="/gradient_descent.png"
                            alt="Gradient descent animation"
                            className="w-full h-auto object-cover"
                        />
                        <div className="bg-slate-50 px-4 py-2 text-center text-xs text-slate-400 font-medium border-t border-slate-100">
                            Representación visual del descenso por la superficie de error hacia el mínimo global
                        </div>
                    </div>

                    <p>
                        Sin embargo, esta analogía también ilustra uno de los mayores desafíos del algoritmo: <strong>los mínimos locales</strong>. Al estar rodeado de niebla, el modelo no tiene una visión global del paisaje. Podría ocurrir que desciendas hasta el fondo de un valle pequeño creyendo que has llegado al punto más bajo posible, sin darte cuenta de que existe un valle mucho más profundo (el mínimo global).
                    </p>
                    <p>
                        Si el algoritmo llega a un valle donde el terreno vuelve a subir en todas direcciones, se detendrá. Gran parte de la complejidad en el diseño del modelo consiste precisamente en tratar de escapar de estos mínimos locales engañosos para encontrar el verdadero mínimo global. Aquí entran en juego los <strong>hiperparámetros</strong> que iremos conociendo a lo largo de este viaje.
                    </p>
                </div>
            </section>

            {/* Math Section */}
            <section className="card-elevated p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 text-lg">4</span>
                    La Matemática de la Exploración
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                    <p>
                        Aquí entra en juego el concepto de <strong>gradiente</strong>, que se define como la dirección de máximo crecimiento de una función. Por lógica, si tomamos la dirección opuesta, nos moveremos en la dirección de máximo descenso.
                    </p>
                    <div className="bg-slate-900 p-8 rounded-2xl text-center shadow-inner">
                        <code className="text-2xl text-indigo-300 font-mono">
                            w = w - η ∇ J(w)
                        </code>
                    </div>
                    <ul className="space-y-4 list-none p-0">
                        <li className="flex gap-4 items-start">
                            <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono font-bold text-sm">w</div>
                            <p><strong>Parámetros:</strong> Los pesos del modelo que estamos optimizando.</p>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono font-bold text-sm">∇ J(w)</div>
                            <p><strong>Gradiente:</strong> Indica la dirección y la inclinación de la pendiente en nuestro punto actual.</p>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono font-bold text-sm">η</div>
                            <p><strong>Tasa de Aprendizaje (Learning Rate):</strong> Controla el tamaño de los pasos. Si es muy grande, podríamos saltarnos el fondo del valle; si es muy pequeño, el aprendizaje será extremadamente lento.</p>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Footer / CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl text-center">
                <p className="text-lg font-medium">
                    En las pestañas de <strong>Regresión Lineal</strong> y <strong>Regresión Logística</strong> podrás conocer con mayor profundidad cómo se aplica el algoritmo a cada tipo de problema.
                </p>
            </div>
        </div>
    );
};

export default TheoryContent;
