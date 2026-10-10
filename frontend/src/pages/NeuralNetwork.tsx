import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchNNPlayground } from "../api";
import type { NNPlaygroundResponse } from "../api";
import { forward } from "../components/nn/network";
import type { SelectedNeuron } from "../components/nn/network";
import NetworkGraph from "../components/nn/NetworkGraph";
import DataCanvas from "../components/nn/DataCanvas";
import { useT } from "../i18n";

const NeuralNetwork: React.FC = () => {
    const t = useT("neuralnet");
    const [net, setNet] = useState<NNPlaygroundResponse | null>(null);
    // Only a flag is stored: the message is read from the dictionary at render
    // time, so it follows a language switch instead of freezing at fetch time.
    const [hasError, setHasError] = useState<boolean>(false);
    const [x1, setX1] = useState<number>(1.0);
    const [x2, setX2] = useState<number>(0.8);
    const [animStep, setAnimStep] = useState<number | null>(null);
    const [selected, setSelected] = useState<SelectedNeuron>(null);
    const animTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchNNPlayground()
            .then(setNet)
            .catch(() => setHasError(true));
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
                    <h4 className="font-bold text-slate-900 mb-2">{t.inspector.inputTitle(selected.index + 1)}</h4>
                    <p className="text-sm text-slate-600 mb-3">
                        {t.inspector.inputBody}
                    </p>
                    <div className={mono}>{t.inspector.inputValue} = {v.toFixed(2)}</div>
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
                    <h4 className="font-bold text-slate-900 mb-2">{t.inspector.hiddenTitle(j + 1)}</h4>
                    <p className="text-sm text-slate-600 mb-3">
                        {t.inspector.hiddenBody}
                        {a === 0 && (
                            <span className="text-orange-600 font-semibold">{t.inspector.hiddenInactive}</span>
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
                <h4 className="font-bold text-slate-900 mb-2">{t.inspector.outputTitle}</h4>
                <p className="text-sm text-slate-600 mb-3">
                    {t.inspector.outputBody}
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
                    {t.header.title}
                </h1>
                <div className="h-8 w-px bg-slate-200 shrink-0 hidden md:block"></div>
                <p className="text-[clamp(0.75rem,1.5vw,1.1rem)] text-slate-400 font-medium italic leading-tight max-w-[50%]">
                    {t.header.subtitle}
                </p>
            </header>

            {hasError && (
                <div className="mx-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {t.connectionError}
                </div>
            )}

            {!net && !hasError && (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                    {t.training}
                </div>
            )}

            {net && fp && (
                <div className="px-6 space-y-6">
                    {/* Problem explanation */}
                    <section className="card-elevated p-6">
                        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                            {t.problem(net.b1.length)}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Input panel */}
                        <div className="space-y-6">
                            <section className="card-elevated p-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                    {t.inputSpace}
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

                            {/* Prediction */}
                            <section className="card-elevated p-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">{t.prediction.heading}</h3>
                                <div className="flex items-baseline gap-3">
                                    <span
                                        className={`text-4xl font-extrabold font-mono ${fp.outputA >= 0.5 ? "text-indigo-600" : "text-orange-600"}`}
                                    >
                                        {(fp.outputA * 100).toFixed(1)}%
                                    </span>
                                    <span className="text-sm text-slate-500">{t.prediction.probabilityInside}</span>
                                </div>
                                <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${fp.outputA >= 0.5 ? "bg-indigo-600" : "bg-orange-600"}`}
                                        style={{ width: `${fp.outputA * 100}%` }}
                                    />
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    {t.prediction.activeNeurons}{" "}
                                    <strong className="text-slate-700 font-mono">
                                        {fp.hiddenA.filter((a) => a > 0).length} / {fp.hiddenA.length}
                                    </strong>
                                    {" · "}{t.prediction.accuracy} <strong className="text-slate-700 font-mono">{(net.accuracy * 100).toFixed(0)}%</strong>
                                </p>
                            </section>
                        </div>

                        {/* Network graph */}
                        <section className="card-elevated p-6 lg:col-span-2">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.graph.heading}</h3>
                                <button
                                    onClick={startAnimation}
                                    disabled={animStep !== null}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {t.graph.propagate}
                                </button>
                            </div>

                            {animStep !== null && (
                                <div className="mb-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm font-medium animate-fade-in-up">
                                    {t.steps[animStep as 1 | 2 | 3 | 4 | 5]}
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

                    {/* Theory */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card-elevated p-6">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">⚖️</span> {t.theory.weighted.title}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {t.theory.weighted.body}
                            </p>
                        </div>
                        <div className="card-elevated p-6">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">⚡</span> {t.theory.relu.title}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {t.theory.relu.body}
                            </p>
                        </div>
                        <div className="card-elevated p-6">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">🧩</span> {t.theory.concepts.title}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {t.theory.concepts.body}
                            </p>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default NeuralNetwork;
