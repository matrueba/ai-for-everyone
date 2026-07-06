import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchNNPlayground } from "../api";
import type { NNPlaygroundResponse } from "../api";
import { forward } from "../components/nn/network";
import type { SelectedNeuron } from "../components/nn/network";
import NetworkGraph from "../components/nn/NetworkGraph";
import DataCanvas from "../components/nn/DataCanvas";

const STEP_CAPTIONS: Record<number, string> = {
    1: "1 · Los valores de entrada (x₁, x₂) llegan a las neuronas de la primera capa.",
    2: "2 · Cada conexión multiplica el valor por su peso w. Las líneas brillantes transportan más señal.",
    3: "3 · Cada neurona oculta suma sus entradas ponderadas más su sesgo, y aplica ReLU: si la suma es negativa, la neurona no se activa.",
    4: "4 · Las activaciones de las neuronas encendidas viajan hacia la capa de salida.",
    5: "5 · La función sigmoide convierte la suma final en una probabilidad entre 0 y 1.",
};

const NeuralNetwork: React.FC = () => {
    const [net, setNet] = useState<NNPlaygroundResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [x1, setX1] = useState<number>(1.0);
    const [x2, setX2] = useState<number>(0.8);
    const [animStep, setAnimStep] = useState<number | null>(null);
    const [selected, setSelected] = useState<SelectedNeuron>(null);
    const animTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchNNPlayground()
            .then(setNet)
            .catch(() => setError("No se pudo conectar con el backend. Arranca el servidor en el puerto 8000."));
        return () => {
            if (animTimer.current) clearInterval(animTimer.current);
        };
    }, []);

    const fp = useMemo(() => (net ? forward(net, x1, x2) : null), [net, x1, x2]);

    const startAnimation = () => {
        if (animTimer.current) clearInterval(animTimer.current);
        setSelected(null);
        setAnimStep(1);
        let step = 1;
        animTimer.current = setInterval(() => {
            step += 1;
            if (step > 5) {
                if (animTimer.current) clearInterval(animTimer.current);
                animTimer.current = null;
                setAnimStep(null);
            } else {
                setAnimStep(step);
            }
        }, 1100);
    };

    const renderInspector = () => {
        if (!net || !fp || selected === null) return null;

        const mono = "font-mono text-[0.8rem] text-slate-700 bg-slate-50 rounded-lg p-4 overflow-x-auto whitespace-nowrap";

        if (selected.layer === "input") {
            const v = fp.input[selected.index as 0 | 1] ?? 0;
            return (
                <div>
                    <h4 className="font-bold text-slate-900 mb-2">Neurona de entrada x{selected.index + 1}</h4>
                    <p className="text-sm text-slate-600 mb-3">
                        Las neuronas de entrada no calculan nada: simplemente transmiten el valor de la característica hacia la capa oculta.
                    </p>
                    <div className={mono}>valor = {v.toFixed(2)}</div>
                </div>
            );
        }

        if (selected.layer === "hidden") {
            const j = selected.index;
            const w1 = net.W1[0]?.[j] ?? 0;
            const w2 = net.W1[1]?.[j] ?? 0;
            const b = net.b1[j] ?? 0;
            const z = fp.hiddenZ[j] ?? 0;
            const a = fp.hiddenA[j] ?? 0;
            return (
                <div>
                    <h4 className="font-bold text-slate-900 mb-2">Neurona oculta #{j + 1}</h4>
                    <p className="text-sm text-slate-600 mb-3">
                        Primero calcula la <strong>suma ponderada</strong> de sus entradas más el sesgo, y después aplica la
                        función de activación <strong>ReLU</strong>: <span className="font-mono">max(0, z)</span>.
                        {a === 0 && (
                            <span className="text-orange-600 font-semibold"> Como z es negativo, esta neurona no se activa (salida 0).</span>
                        )}
                    </p>
                    <div className={mono}>
                        z = w₁·x₁ + w₂·x₂ + b = ({w1.toFixed(2)})·({x1.toFixed(2)}) + ({w2.toFixed(2)})·({x2.toFixed(2)}) + ({b.toFixed(2)}) = {z.toFixed(3)}
                        <br />
                        a = ReLU(z) = max(0, {z.toFixed(3)}) = <strong>{a.toFixed(3)}</strong>
                    </div>
                </div>
            );
        }

        const terms = net.W2.map((w, j) => `(${w.toFixed(2)})·(${(fp.hiddenA[j] ?? 0).toFixed(2)})`).join(" + ");
        return (
            <div>
                <h4 className="font-bold text-slate-900 mb-2">Neurona de salida</h4>
                <p className="text-sm text-slate-600 mb-3">
                    Suma las activaciones de todas las neuronas ocultas (ponderadas por sus pesos) y aplica la{" "}
                    <strong>sigmoide</strong> para obtener una probabilidad entre 0 y 1.
                </p>
                <div className={mono}>
                    z = {terms} + ({net.b2.toFixed(2)}) = {fp.outputZ.toFixed(3)}
                    <br />
                    ŷ = σ(z) = 1 / (1 + e^(−z)) = <strong>{fp.outputA.toFixed(3)}</strong>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-y-auto custom-scrollbar pb-12">
            {/* Header */}
            <header className="flex flex-row items-center gap-6 overflow-hidden shrink-0 p-6">
                <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold text-slate-900 tracking-tighter shrink-0">
                    Neuronas en Acción
                </h1>
                <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block"></div>
                <p className="text-[clamp(0.75rem,1.5vw,1.1rem)] text-slate-400 font-medium italic leading-tight max-w-[50%]">
                    Observa cómo se activan las neuronas de una red neuronal real mientras hace una inferencia.
                </p>
            </header>

            {error && (
                <div className="mx-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {error}
                </div>
            )}

            {!net && !error && (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                    Entrenando la red neuronal...
                </div>
            )}

            {net && fp && (
                <div className="px-6 space-y-6">
                    {/* Explicación del problema */}
                    <section className="card-elevated p-6">
                        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                            Esta red neuronal (2 entradas → {net.b1.length} neuronas ocultas → 1 salida) ha sido entrenada para resolver
                            un problema sencillo: decidir si un punto <span className="font-mono">(x₁, x₂)</span> está{" "}
                            <strong className="text-indigo-600">dentro</strong> o{" "}
                            <strong className="text-orange-600">fuera</strong> de un círculo. Un modelo lineal no puede resolverlo,
                            pero una sola capa oculta sí. <strong>Arrastra el punto</strong> sobre el mapa (o usa los deslizadores) y
                            observa qué neuronas se encienden y qué señal fluye por cada conexión.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Panel de entrada */}
                        <div className="space-y-6">
                            <section className="card-elevated p-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                    Espacio de entrada
                                </h3>
                                <DataCanvas
                                    net={net}
                                    x1={x1}
                                    x2={x2}
                                    onChange={(nx1, nx2) => {
                                        setX1(nx1);
                                        setX2(nx2);
                                    }}
                                />
                                <div className="mt-5 space-y-4">
                                    {[
                                        { label: "x₁", value: x1, set: setX1 },
                                        { label: "x₂", value: x2, set: setX2 },
                                    ].map(({ label, value, set }) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                                <span>{label}</span>
                                                <span className="font-mono text-indigo-600">{value.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={-3}
                                                max={3}
                                                step={0.05}
                                                value={value}
                                                onChange={(e) => set(parseFloat(e.target.value))}
                                                className="w-full accent-indigo-600"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Predicción */}
                            <section className="card-elevated p-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Predicción</h3>
                                <div className="flex items-baseline gap-3">
                                    <span
                                        className={`text-4xl font-extrabold font-mono ${fp.outputA >= 0.5 ? "text-indigo-600" : "text-orange-600"}`}
                                    >
                                        {(fp.outputA * 100).toFixed(1)}%
                                    </span>
                                    <span className="text-sm text-slate-500">probabilidad de estar dentro</span>
                                </div>
                                <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${fp.outputA >= 0.5 ? "bg-indigo-600" : "bg-orange-600"}`}
                                        style={{ width: `${fp.outputA * 100}%` }}
                                    />
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    Neuronas ocultas activas:{" "}
                                    <strong className="text-slate-700 font-mono">
                                        {fp.hiddenA.filter((a) => a > 0).length} / {fp.hiddenA.length}
                                    </strong>
                                    {" · "}Precisión de la red: <strong className="text-slate-700 font-mono">{(net.accuracy * 100).toFixed(0)}%</strong>
                                </p>
                            </section>
                        </div>

                        {/* Grafo de la red */}
                        <section className="card-elevated p-6 lg:col-span-2">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">La red por dentro</h3>
                                <button
                                    onClick={startAnimation}
                                    disabled={animStep !== null}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    ▶ Propagar señal paso a paso
                                </button>
                            </div>

                            {animStep !== null && (
                                <div className="mb-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm font-medium animate-fade-in-up">
                                    {STEP_CAPTIONS[animStep]}
                                </div>
                            )}

                            <NetworkGraph net={net} fp={fp} animStep={animStep} selected={selected} onSelect={setSelected} />

                            {selected !== null && (
                                <div className="mt-4 p-5 rounded-xl border border-cyan-200 bg-cyan-50/50 animate-fade-in-up">
                                    {renderInspector()}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Teoría */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card-elevated p-6">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">⚖️</span> Suma ponderada
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Cada neurona multiplica cada entrada por un <strong>peso</strong> (aprendido durante el
                                entrenamiento) y suma un <strong>sesgo</strong>. Los pesos positivos (líneas índigo) excitan a la
                                neurona; los negativos (líneas naranjas) la inhiben.
                            </p>
                        </div>
                        <div className="card-elevated p-6">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">⚡</span> Activación ReLU
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                La función <span className="font-mono">ReLU(z) = max(0, z)</span> decide si la neurona "se
                                enciende". Si la suma ponderada es negativa, la neurona queda <strong>inactiva</strong> y no aporta
                                nada. Esta no-linealidad es lo que permite a la red aprender fronteras curvas como el círculo.
                            </p>
                        </div>
                        <div className="card-elevated p-6">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">🧩</span> De neuronas a conceptos
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Cada neurona oculta aprende a detectar una "franja" del espacio de entrada. La capa de salida
                                combina esas detecciones simples para formar la frontera circular. Los LLMs funcionan con el mismo
                                principio, pero con <strong>miles de millones</strong> de neuronas.
                            </p>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default NeuralNetwork;
