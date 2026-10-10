import React, { useState, useEffect } from 'react';
import RegressionPlot from './RegressionPlot';
import CostSurface from './CostSurface';
import Backprop3D from './Backprop3D';
import RegressionPlot3D from './RegressionPlot3D';
import { useT } from '../../i18n';

import type { Step, SurfaceData } from './types';

interface FormattedData {
    steps: Step[];
    cost_surface: SurfaceData;
    data: {
        x?: number[];
        y: number[];
        x1?: number[];
        x2?: number[];
    };
}

const gradient_descent_data = (vizMode: '2d' | '3d') => {
    let X: number[][], y: number[];
    if (vizMode === '2d') {
        const rawX = Array.from({ length: 20 }, (_, i) => -5 + (i * 10 / 19));
        X = rawX.map(x => [x]);
        y = rawX.map(x => 2 * x + 1 + (Math.random() - 0.5) * 2);
    } else {
        // Realistic house pricing dataset
        const n = 100;
        // Raw features: m² (40-250), location rating (1-10)
        const rawM2 = Array.from({ length: n }, () => 40 + Math.random() * 210);
        const rawNota = Array.from({ length: n }, () => 1 + Math.random() * 9);
        // Realistic price: ~1500€/m² + 20000€ per location point + 50k base + noise
        const rawPrecio = rawM2.map((m2, i) =>
            1500 * m2 + 20000 * (rawNota[i] ?? 0) + 50000 + (Math.random() - 0.5) * 30000
        );

        // Min-max normalization to [0, 1]
        const normalize = (arr: number[]) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return arr.map(v => (v - min) / (max - min));
        };

        const normM2 = normalize(rawM2);
        const normNota = normalize(rawNota);
        const normPrecio = normalize(rawPrecio);

        X = normM2.map((m2, i) => [m2, normNota[i] ?? 0]);
        y = normPrecio;
    }
    return { X, y };
}

const LinearRegressionContent: React.FC = () => {
    const gradient = useT('gradient');
    const t = gradient.linear;
    const controls = gradient.controls;
    const [data, setData] = useState<FormattedData | null>(null);
    const [data3d, setData3d] = useState<FormattedData | null>(null);
    const [vizMode, setVizMode] = useState<'2d' | '3d'>('2d');
    const [learningRate, setLearningRate] = useState<number>(0.01);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const { X, y } = gradient_descent_data(vizMode);

        fetch('http://localhost:8000/api/gradient-descent-matrix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                X,
                y,
                learning_rate: learningRate,
                iterations: 100
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
                        w: vizMode === '2d' ? (step.weights[0] ?? 0) : undefined,
                        w1: vizMode === '3d' ? (step.weights[0] ?? 0) : undefined,
                        w2: vizMode === '3d' ? (step.weights[1] ?? 0) : undefined,
                        b: step.bias,
                        predictions: vizMode === '2d'
                            ? X.map(r => (r[0] ?? 0) * step.weights[0] + step.bias)
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
        if (isPlaying && currentData && currentData.steps && currentIteration < (currentData.steps.length ?? 0) - 1) {
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
            <p className="text-slate-600 font-medium">{t.loading}</p>
        </div>
    );

    const activeData = vizMode === '2d' ? data : data3d;
    const currentStep = activeData?.steps[currentIteration];

    return (
        <div className="flex flex-col min-h-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 shrink-0">
                <div className="flex flex-row items-center gap-6 pl-2">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tighter shrink-0">
                        {t.title}
                    </h2>
                    <p className="text-slate-500 font-medium italic leading-tight">
                        {t.subtitle}
                    </p>
                </div>
                <div className="flex bg-slate-200 p-1 rounded-xl border border-slate-200 gap-2">
                    <button
                        onClick={() => setVizMode('2d')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vizMode === '2d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {t.mode2d}
                    </button>
                    <button
                        onClick={() => setVizMode('3d')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vizMode === '3d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {t.mode3d}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
                <div className="flex flex-col col-span-4 min-h-0">
                    <div className="card-elevated p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t.heading}</h3>

                            <p>{t.p1}</p>

                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 my-8">
                                <h4 className="text-indigo-900 font-bold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    {t.scenario.title}
                                </h4>
                                <p className="text-sm text-indigo-800 leading-relaxed">
                                    {t.scenario.lead}
                                </p>
                                <ul className="text-sm text-indigo-800 mt-2 list-disc ml-5 space-y-1">
                                    <li>{t.scenario.bullets[1]}</li>
                                    <li>{t.scenario.bullets[2]}</li>
                                </ul>
                            </div>

                            <p>{t.p2}</p>

                            <h4 className="text-xl font-bold text-slate-900 mt-10 mb-4">{t.modelHeading}</h4>
                            <p>{t.modelLead}</p>

                            <div className="bg-slate-900 p-8 rounded-2xl text-center shadow-inner my-6">
                                <code className="text-2xl text-indigo-300 font-mono">
                                    y = W₁X₁ + W₂X₂ + b
                                </code>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">{t.legend.y}</div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">{t.legend.x}</div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">{t.legend.w}</div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">{t.legend.b}</div>
                            </div>

                            <h4 className="text-xl font-bold text-slate-900 mt-10 mb-4">{t.realtimeHeading}</h4>
                            <p>{t.realtimeBody}</p>

                            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 mt-8">
                                <h4 className="text-rose-900 font-bold mb-3">{t.lrBox.title}</h4>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-bold text-rose-700">{t.lrBox.tooLowLabel}</span>
                                        <p className="text-sm text-rose-800">{t.lrBox.tooLowBody}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-rose-700">{t.lrBox.tooHighLabel}</span>
                                        <p className="text-sm text-rose-800">{t.lrBox.tooHighBody}</p>
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
                            {isPlaying ? controls.pause : controls.start}
                        </button>
                        <button
                            onClick={() => {
                                setCurrentIteration(0);
                                setIsPlaying(false);
                            }}
                            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                        >
                            {controls.reset}
                        </button>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{controls.learningRate}</span>
                            <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                max="1"
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
                            <span className="text-xs text-indigo-400 uppercase font-bold block">{controls.iteration}</span>
                            <span className="text-xl font-mono font-bold text-indigo-700">{currentIteration}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
                        {vizMode === '2d' ? (
                            <>
                                <RegressionPlot data={data?.data} currentStep={currentStep} />
                                <CostSurface surface={data?.cost_surface || null} steps={data?.steps || null} currentIteration={currentIteration} />
                            </>
                        ) : (
                            <>
                                <RegressionPlot3D data={data3d?.data} currentStep={currentStep} />
                                <Backprop3D surface={data3d?.cost_surface || null} steps={data3d?.steps || null} currentIteration={currentIteration} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinearRegressionContent;
