import React, { useState, useEffect } from 'react';
import LogisticRegressionPlot from './LogisticRegressionPlot';
import CostSurface from './CostSurface';
import LogisticRegressionPlot3D from './LogisticRegressionPlot3D';
import Backprop3D from './Backprop3D';

import type { Step, SurfaceData, PlotData } from './types';

interface FormattedData {
    steps: Step[];
    cost_surface: SurfaceData;
    data: PlotData;
}

const logistic_regression_data = (vizMode: '2d' | '3d') => {
    let X: number[][], y: number[];
    if (vizMode === '2d') {
        const rawX = Array.from({ length: 40 }, (_, i) => -5 + (i * 10 / 39));
        X = rawX.map(x => [x]);
        y = rawX.map(x => (Math.random() < (1 / (1 + Math.exp(-(2 * x - 1)))) ? 1 : 0));
    } else {
        X = Array.from({ length: 100 }, () => [
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        ]);
        y = X.map((row) => {
            const x1 = row[0] ?? 0;
            const x2 = row[1] ?? 0;
            return (Math.random() < (1 / (1 + Math.exp(-(2 * x1 + 3 * x2 + 1)))) ? 1 : 0);
        });
    }
    return { X, y };
}

const LogisticRegressionContent: React.FC = () => {
    const [data, setData] = useState<FormattedData | null>(null);
    const [data3d, setData3d] = useState<FormattedData | null>(null);
    const [vizMode, setVizMode] = useState<'2d' | '3d'>('2d');
    const [learningRate, setLearningRate] = useState<number>(0.5);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const { X, y } = logistic_regression_data(vizMode);

        fetch('http://localhost:8000/api/logistic-regression-matrix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                X,
                y,
                learning_rate: learningRate,
                iterations: 150
            })
        })
            .then(res => res.json())
            .then((resData: any) => {
                const formattedData: FormattedData = {
                    ...resData,
                    data: vizMode === '2d'
                        ? { x: X.map(r => r[0] ?? 0), y: y }
                        : { x1: X.map(r => r[0] ?? 0), x2: X.map(r => r[1] ?? 0), y: y },
                    steps: resData.steps.map((step: any) => ({
                        ...step,
                        w: vizMode === '2d' ? step.weights[0] : undefined,
                        w1: vizMode === '3d' ? step.weights[0] : undefined,
                        w2: vizMode === '3d' ? step.weights[1] : undefined,
                        b: step.bias,
                        predictions: vizMode === '2d'
                            ? X.map(r => 1 / (1 + Math.exp(-((r[0] ?? 0) * (step.weights?.[0] ?? 0) + (step.bias ?? 0)))))
                            : undefined
                    }))
                };

                if (vizMode === '2d') {
                    setData(formattedData);
                } else {
                    setData3d(formattedData);
                }
                setCurrentIteration(0);
                setIsPlaying(false);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [vizMode, learningRate]);

    useEffect(() => {
        let interval: any;
        const currentData = vizMode === '2d' ? data : data3d;
        if (isPlaying && currentData && currentIteration < currentData.steps.length - 1) {
            interval = setInterval(() => {
                setCurrentIteration(prev => prev + 1);
            }, 100);
        } else {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, data, data3d, currentIteration, vizMode]);

    if (loading && !data && !data3d) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading logistic regression...</p>
        </div>
    );

    const activeData = vizMode === '2d' ? data : data3d;
    const currentStep = activeData?.steps ? activeData.steps[currentIteration] : undefined;

    return (
        <div className="flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 shrink-0">
                <div className="flex flex-row items-center gap-6 pl-2">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tighter shrink-0">
                        Logistic Regression
                    </h2>
                    <p className="text-slate-500 font-medium italic leading-tight">
                        Classify data points into categories using the sigmoid function.
                    </p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-xl border border-slate-200 gap-2">
                    <button
                        onClick={() => setVizMode('2d')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vizMode === '2d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Ejemplo 1 (2D)
                    </button>
                    <button
                        onClick={() => setVizMode('3d')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vizMode === '3d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Probabilidad Admisión (3D)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
                <div className="flex flex-col col-span-4 min-h-0">
                    <div className="card-elevated p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Fundamentos de la Regresión Logística</h3>

                            <p>
                                Cuando el objetivo es predecir una <strong>categoría o clase binaria</strong> (como Sí/No, Spam/No Spam o Admitido/Rechazado) en lugar de un número continuo, recurrimos a la Regresión Logística.
                            </p>

                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 my-8">
                                <h4 className="text-indigo-900 font-bold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    Escenario de Ejemplo: Admisión Universitaria
                                </h4>
                                <p className="text-sm text-indigo-800 leading-relaxed">
                                    Queremos predecir la probabilidad de que un estudiante sea admitido (<strong>y = 1</strong> o <strong>0</strong>) basándonos en dos características principales:
                                </p>
                                <ul className="text-sm text-indigo-800 mt-2 list-disc ml-5 space-y-1">
                                    <li>Las horas semanales de estudio (<strong>X₁</strong>).</li>
                                    <li>La puntuación en el examen de ingreso (<strong>X₂</strong>).</li>
                                </ul>
                            </div>

                            <p>
                                A diferencia de la regresión lineal, no podemos simplemente trazar una línea recta que se ajuste a los datos. Debemos aplicar funciones no lineales que transformen el resultado, acotándolo entre <strong>0 y 1</strong> (0% y 100%). La función típica usada para este propósito es la función <strong>sigmoide</strong>. Posteriormente, conoceremos otras funciones no lineales utilizadas en problemas de clasificación, como la tangente hiperbólica.
                            </p>

                            <div className="flex flex-col items-center my-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <img src="/sigmoid_function.png" alt="Función Sigmoide" className="w-full max-w-md rounded-lg" />
                                <p className="text-sm text-slate-500 italic mt-4 text-center max-w-[300px]">
                                    La función sigmoide transforma cualquier valor real en un valor acotado entre 0 y 1.
                                </p>
                            </div>

                            <h4 className="text-xl font-bold text-slate-900 mt-10 mb-4">El Modelo Matemático</h4>
                            <p>
                                La salida del modelo se calcula pasando la combinación lineal de las características a través de la función sigmoide:
                            </p>

                            <div className="bg-slate-900 p-8 rounded-2xl text-center shadow-inner my-6">
                                <div className="text-2xl text-indigo-300 font-mono mb-2">
                                    z = W₁X₁ + W₂X₂ + b
                                </div>
                                <div className="text-2xl text-indigo-300 font-mono">
                                    y = σ(z) = 1 / (1 + e<sup>-z</sup>)
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-800">y:</span> Probabilidad predicha (entre 0 y 1) de admisión.
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-800">z:</span> Combinación lineal de las características.
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-800">X₁ / X₂:</span> Variables de entrada (horas y examen).
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-800">W₁ / W₂ / b:</span> Pesos y sesgo que determinan la frontera de decisión.
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-800">σ():</span> Función sigmoide.
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-slate-900 mt-10 mb-4">La Función Sigmoide y la Frontera</h4>
                            <p>
                                La función sigmoide aplasta cualquier valor real en el intervalo (0, 1). Si <strong>y &ge; 0.5</strong>, clasificamos la predicción como clase 1 (Admitido); si es menor, como clase 0. El lugar geométrico donde la probabilidad es exactamente 0.5 (es decir, z = 0) se conoce como la <strong>frontera de decisión</strong>.
                            </p>

                            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 mt-8">
                                <h4 className="text-rose-900 font-bold mb-3">La Función de Pérdida: Entropía Cruzada</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-rose-800">
                                            En regresión logística no usamos el Error Cuadrático Medio, sino la <strong>Entropía Cruzada Binaria (Log Loss)</strong>. Esta función penaliza fuertemente a los errores cometidos con alta confianza. Por ejemplo, predecir una probabilidad de 0.01 cuando la clase real es 1 genera una penalización exponencialmente grande.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-8 flex flex-col min-h-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 card-elevated p-3 shrink-0">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${isPlaying ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}
                        >
                            {isPlaying ? 'Pause' : 'Start Training'}
                        </button>
                        <button
                            onClick={() => {
                                setCurrentIteration(0);
                                setIsPlaying(false);
                            }}
                            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                        >
                            Reset
                        </button>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">LR:</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="5"
                                value={learningRate}
                                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-2 px-3 font-mono w-24"
                            />
                        </div>
                        <div className="flex-1 flex items-center gap-4 min-w-[200px]">
                            <span className="text-xs font-mono font-bold text-slate-400">0</span>
                            <input
                                type="range"
                                min="0"
                                max={(activeData?.steps?.length ?? 1) - 1}
                                value={currentIteration}
                                onChange={(e) => setCurrentIteration(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <span className="text-xs font-mono font-bold text-slate-400">{(activeData?.steps?.length ?? 1) - 1}</span>
                        </div>
                        <div className="px-4 py-2 bg-indigo-50 rounded-lg">
                            <span className="text-xs text-indigo-400 uppercase font-bold block">Iteration</span>
                            <span className="text-xl font-mono font-bold text-indigo-700">{currentIteration}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
                        {vizMode === '2d' ? (
                            <>
                                <LogisticRegressionPlot data={data?.data} currentStep={currentStep} />
                                <CostSurface surface={data?.cost_surface ?? null} steps={data?.steps ?? null} currentIteration={currentIteration} />
                            </>
                        ) : (
                            <>
                                <LogisticRegressionPlot3D data={data3d?.data} currentStep={currentStep} />
                                <Backprop3D surface={data3d?.cost_surface ?? null} steps={data3d?.steps ?? null} currentIteration={currentIteration} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticRegressionContent;
