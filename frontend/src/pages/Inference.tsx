import React, { useState, useEffect, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponentModule from 'react-plotly.js/factory';
import { useI18n, useT } from '../i18n';
import type { InferenceScenarioId } from '../i18n/content-types';

// Fix for react-plotly.js typing/import issue in some environments
const createPlotlyComponent = (createPlotlyComponentModule as any).default || createPlotlyComponentModule;
const Plot = createPlotlyComponent(Plotly);

interface ModelData {
    w1: number;
    w2: number;
    b: number;
    dataX1: number[];
    dataX2: number[];
    dataY: number[];
}

/** Numeric setup of a scenario — language independent, so it stays in the component. */
interface ScenarioRanges {
    x1Range: [number, number];
    x2Range: [number, number];
    defaultX1: number;
    defaultX2: number;
    step1: number;
    step2: number;
    isClassification?: boolean;
}

/** Ranges + the active locale's copy + locale-aware formatters. */
interface TabConfig extends ScenarioRanges {
    id: InferenceScenarioId;
    tab: string;
    title: string;
    description: string;
    x1Label: string;
    x2Label: string;
    yLabel: string;
    format1: (v: number) => string;
    format2: (v: number) => string;
    formatY: (v: number) => string;
}

const SCENARIO_IDS: InferenceScenarioId[] = ['generic', 'houses', 'admission'];

const SCENARIO_RANGES: Record<InferenceScenarioId, ScenarioRanges> = {
    generic: {
        x1Range: [-6, 6],
        x2Range: [-6, 6],
        defaultX1: 2.0,
        defaultX2: -1.0,
        step1: 0.1,
        step2: 0.1,
        isClassification: false,
    },
    houses: {
        x1Range: [40, 300],
        x2Range: [0, 10],
        defaultX1: 100,
        defaultX2: 7,
        step1: 1,
        step2: 0.1,
        isClassification: false,
    },
    admission: {
        x1Range: [0, 100],
        x2Range: [0, 20],
        defaultX1: 70,
        defaultX2: 10,
        step1: 1,
        step2: 0.5,
        isClassification: true,
    },
};

interface InferencePlot3DProps {
    model: ModelData | null;
    inputX1: number;
    inputX2: number;
    predY: number;
    config: TabConfig;
}

const InferencePlot3D: React.FC<InferencePlot3DProps> = ({ model, inputX1, inputX2, predY, config }) => {
    const t = useT('inference').plot;

    if (!model) return null;

    const { dataX1, dataX2, dataY, w1, w2, b } = model;

    const planeData = useMemo(() => {
        const x1Min = config.x1Range[0];
        const x1Max = config.x1Range[1];
        const x2Min = config.x2Range[0];
        const x2Max = config.x2Range[1];

        const steps = config.isClassification ? 30 : 3;
        const x1Range: number[] = [];
        const x2Range: number[] = [];
        for (let i = 0; i <= steps; i++) {
            x1Range.push(x1Min + (x1Max - x1Min) * i / steps);
            x2Range.push(x2Min + (x2Max - x2Min) * i / steps);
        }

        const zPlane = x2Range.map(x2Val =>
            x1Range.map(x1Val => {
                const z = w1 * x1Val + w2 * x2Val + b;
                return config.isClassification ? 1 / (1 + Math.exp(-z)) : z;
            })
        );
        return { x: x1Range, y: x2Range, z: zPlane };
    }, [w1, w2, b, config]);

    const minZ = config.isClassification ? 0 : Math.min(...dataY, predY);
    const maxZ = config.isClassification ? 1 : Math.max(...dataY, predY);
    const zRange = maxZ - minZ;
    const plotMinZ = config.isClassification ? 0 : (minZ - zRange * 0.1);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 z-10"></div>
            <div className="p-6 pb-0">
                <h3 className="text-xl font-bold text-slate-800">{config.title}</h3>
                <p className="text-slate-500 text-sm">
                    {config.description}
                </p>
            </div>


            <div className="flex-1 w-full h-full min-h-0">
                <Plot
                    data={[
                        {
                            x: dataX1, y: dataX2, z: dataY,
                            type: 'scatter3d', mode: 'markers',
                            marker: {
                                size: 3.5,
                                color: config.isClassification
                                    ? dataY.map(yVal => yVal === 1 ? '#10b981' : '#ef4444')
                                    : '#cbd5e1',
                                opacity: config.isClassification ? 0.8 : 0.5
                            },
                            name: t.dataName
                        },
                        {
                            x: planeData.x, y: planeData.y, z: planeData.z,
                            type: 'surface',
                            colorscale: [[0, 'rgba(99, 102, 241, 0.4)'], [1, 'rgba(14, 165, 233, 0.4)']],
                            showscale: false,
                            name: t.modelName,
                            hoverinfo: 'none',
                            contours: {
                                z: { show: true, usecolormap: true, highlightcolor: "white", project: { z: false } }
                            }
                        },
                        {
                            x: [inputX1, inputX1],
                            y: [inputX2, inputX2],
                            z: [plotMinZ, predY],
                            type: 'scatter3d', mode: 'lines',
                            line: { color: '#f43f5e', width: 6, dash: 'dash' },
                            name: t.projectionName
                        },
                        {
                            x: [inputX1, inputX1],
                            y: [inputX2, inputX2],
                            z: [plotMinZ, predY],
                            type: 'scatter3d', mode: 'markers',
                            marker: {
                                size: 8,
                                color: ['#8b5cf6', '#10b981'],
                                line: { color: 'white', width: 2 }
                            },
                            text: [
                                `${t.inputTooltip} (${config.x1Label}=${config.format1(inputX1)}, ${config.x2Label}=${config.format2(inputX2)})`,
                                `${t.predictionTooltip} ${config.yLabel}=${config.formatY(predY)}`
                            ],
                            hoverinfo: 'text',
                            name: t.keyPointsName
                        }
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 0, r: 0, b: 0, t: 0 },
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        scene: {
                            xaxis: { title: config.x1Label, gridcolor: 'white', backgroundcolor: 'rgb(248, 250, 252)', showbackground: true },
                            yaxis: { title: config.x2Label, gridcolor: 'white', backgroundcolor: 'rgb(248, 250, 252)', showbackground: true },
                            zaxis: {
                                title: config.yLabel,
                                gridcolor: 'white',
                                backgroundcolor: 'rgb(241, 245, 249)',
                                showbackground: true,
                                range: config.isClassification ? [0, 1] : undefined
                            },
                            camera: { eye: { x: 1.5, y: 1.5, z: 0.8 } }
                        },
                        showlegend: true,
                        legend: { x: 0, y: 1 }
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%', height: '100%' }}
                    useResizeHandler={true}
                />
            </div>
        </div>
    );
};

const Inference: React.FC = () => {
    const t = useT('inference');
    const { formatNumber } = useI18n();
    const [activeTab, setActiveTab] = useState<InferenceScenarioId>('generic');
    const [model, setModel] = useState<ModelData | null>(null);
    const [inputX1, setInputX1] = useState<number>(SCENARIO_RANGES.generic.defaultX1);
    const [inputX2, setInputX2] = useState<number>(SCENARIO_RANGES.generic.defaultX2);
    const [predY, setPredY] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    /** Copy + ranges + formatters, rebuilt whenever the language changes. */
    const tabConfigs = useMemo<Record<InferenceScenarioId, TabConfig>>(() => {
        const fixed = (digits: number) => (v: number) =>
            formatNumber(v, { minimumFractionDigits: digits, maximumFractionDigits: digits });

        return {
            generic: {
                id: 'generic',
                ...t.scenarios.generic,
                ...SCENARIO_RANGES.generic,
                format1: fixed(2),
                format2: fixed(2),
                formatY: fixed(4),
            },
            houses: {
                id: 'houses',
                ...t.scenarios.houses,
                ...SCENARIO_RANGES.houses,
                format1: (v) => `${fixed(0)(v)} m²`,
                format2: (v) => `${fixed(1)(v)}/10`,
                formatY: (v) => formatNumber(v, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
            },
            admission: {
                id: 'admission',
                ...t.scenarios.admission,
                ...SCENARIO_RANGES.admission,
                format1: (v) => `${fixed(0)(v)}/100`,
                format2: (v) => `${fixed(1)(v)}h`,
                formatY: (v) => `${fixed(1)(v * 100)}%`,
            },
        };
    }, [t, formatNumber]);

    const currentConfig = tabConfigs[activeTab];

    useEffect(() => {
        setLoading(true);

        fetch(`http://localhost:8000/api/inference-scenario?scenario=${activeTab}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch scenario data");
                return res.json();
            })
            .then(data => {
                setModel({
                    w1: data.weights?.[0] ?? 0,
                    w2: data.weights?.[1] ?? 0,
                    b: data.bias ?? 0,
                    dataX1: (data.X ?? []).map((r: number[]) => r[0] ?? 0),
                    dataX2: (data.X ?? []).map((r: number[]) => r[1] ?? 0),
                    dataY: data.y ?? []
                });
                const ranges = SCENARIO_RANGES[activeTab];
                setInputX1(ranges.defaultX1);
                setInputX2(ranges.defaultX2);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load scenario:", err);
                setLoading(false);
            });
    }, [activeTab]);

    useEffect(() => {
        if (!model) return;

        const timer = setTimeout(() => {
            fetch('http://localhost:8000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    x: [inputX1, inputX2],
                    weights: [model.w1, model.w2],
                    bias: model.b
                })
            })
                .then(res => res.json())
                .then(data => {
                    const val = currentConfig.isClassification
                        ? 1 / (1 + Math.exp(-data.prediction))
                        : data.prediction;
                    setPredY(val);
                })
                .catch(err => console.error("Prediction error:", err));
        }, 50);

        return () => clearTimeout(timer);
    }, [inputX1, inputX2, model, currentConfig]);

    return (
        <div className="h-full bg-slate-50 p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{t.title}</h1>
                    <p className="text-slate-600 text-lg max-w-2xl">
                        {t.subtitle}
                    </p>
                </div>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {SCENARIO_IDS.map(id => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            {t.scenarios[id].tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Intro Card */}
            <div className="bg-gradient-to-r from-indigo-50 via-indigo-50 to-sky-50 rounded-2xl p-4 md:p-5 border border-indigo-100/50 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-4 items-center shrink-0">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
                <div>
                    <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                        {t.intro}
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="flex flex-col gap-6 overflow-y-auto pb-2">

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-bl-full -z-10 blur-2xl"></div>

                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">🎮</span>
                            {t.params.heading}
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                    <span>{currentConfig.x1Label}</span>
                                    <span className="text-violet-600 font-mono">{currentConfig.format1(inputX1)}</span>
                                </label>
                                <input
                                    type="range"
                                    min={currentConfig.x1Range[0]}
                                    max={currentConfig.x1Range[1]}
                                    step={currentConfig.step1}
                                    value={inputX1}
                                    onChange={(e) => setInputX1(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                />
                            </div>
                            <div>
                                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                    <span>{currentConfig.x2Label}</span>
                                    <span className="text-sky-600 font-mono">{currentConfig.format2(inputX2)}</span>
                                </label>
                                <input
                                    type="range"
                                    min={currentConfig.x2Range[0]}
                                    max={currentConfig.x2Range[1]}
                                    step={currentConfig.step2}
                                    value={inputX2}
                                    onChange={(e) => setInputX2(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl"></div>

                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">🧠</span>
                            {t.brain.heading}
                        </h2>

                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-slate-400 mb-1">{t.brain.equation}</p>
                                <p className="text-lg font-mono text-sky-400">
                                    {currentConfig.isClassification ? 'Y = σ(W₁·X₁ + W₂·X₂ + b)' : 'Y = W₁·X₁ + W₂·X₂ + b'}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <p className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">W₁</p>
                                    <p className="font-mono text-sm">{model?.w1.toFixed(3)}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <p className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">W₂</p>
                                    <p className="font-mono text-sm">{model?.w2.toFixed(3)}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <p className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">b</p>
                                    <p className="font-mono text-sm">{model?.b.toFixed(1)}</p>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                <p className="text-emerald-200 mb-1 text-xs uppercase tracking-wider">{t.brain.result}</p>
                                <div className="flex flex-col gap-1">
                                    <span className="font-mono text-emerald-400 text-2xl font-bold text-center">
                                        {loading ? '...' : currentConfig.formatY(predY)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="lg:col-span-2 flex flex-col min-h-0 h-full">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-slate-600 font-medium">{t.loading(currentConfig.title)}</p>
                            <p className="text-slate-400 text-xs mt-2">{t.loadingHint}</p>
                        </div>
                    ) : model ? (
                        <InferencePlot3D model={model} inputX1={inputX1} inputX2={inputX2} predY={predY} config={currentConfig} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-red-100 shadow-xl text-red-500">
                            <p className="font-bold">{t.error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold">{t.retry}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inference;
