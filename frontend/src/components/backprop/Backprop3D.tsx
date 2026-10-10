import React, { useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponentModule from 'react-plotly.js/factory';

const createPlotlyComponent = (createPlotlyComponentModule as any).default || createPlotlyComponentModule;
const Plot = createPlotlyComponent(Plotly);

import { useT } from '../../i18n';

import type { Step, SurfaceData } from './types';

interface Backprop3DProps {
    surface: SurfaceData | null;
    steps: Step[] | null;
    currentIteration: number;
}

// Log transform to compress high-cost peaks and reveal the valley
const logTransform = (v: number) => Math.log(1 + v);

const Backprop3D: React.FC<Backprop3DProps> = ({ surface, steps, currentIteration }) => {
    const common = useT('common');
    const t = useT('gradient').plots.backprop3d;

    if (!surface || !steps || steps.length === 0) return (
        <div className="flex items-center justify-center h-full bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            {common.states.noData3d}
        </div>
    );

    const currentStep = steps[currentIteration] || steps[0];

    // Transform surface Z with log scale
    const logSurfaceZ = useMemo(() =>
        surface.z.map(row => row.map(v => logTransform(v))),
        [surface.z]
    );

    // Path of the optimization (log-transformed for consistent scale)
    const pathSlice = steps.slice(0, currentIteration + 1);
    const pathX = pathSlice.map(s => s.w1);
    const pathY = pathSlice.map(s => s.w2);
    const pathZ = pathSlice.map(s => logTransform(s.cost));

    return (
        <div className="card-elevated p-3 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
                <div>
                    <h3 className="text-base font-bold text-slate-800">{t.title}</h3>
                    <p className="text-xs text-slate-500">{t.subtitle}</p>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden rounded-xl bg-slate-50/50 min-h-0 p-1">
                <Plot
                    data={[
                        {
                            z: logSurfaceZ,
                            x: surface.x,
                            y: surface.y,
                            type: 'surface',
                            colorscale: 'Viridis',
                            showscale: false,
                            opacity: 1.0,
                            lighting: {
                                ambient: 0.45,
                                diffuse: 0.55,
                                roughness: 0.4,
                                specular: 0.5,
                                fresnel: 0.15
                            },
                            contours: {
                                z: {
                                    show: true,
                                    usecolormap: true,
                                    highlightcolor: "#444",
                                    project: { z: true },
                                    width: 1
                                }
                            }
                        } as any,
                        {
                            x: pathX,
                            y: pathY,
                            z: pathZ,
                            type: 'scatter3d',
                            mode: 'lines+markers',
                            marker: {
                                size: 5,
                                color: '#ef4444',
                                opacity: 0.9
                            },
                            line: {
                                width: 10,
                                color: '#ef4444',
                            },
                            name: t.pathName
                        } as any,
                        {
                            x: [currentStep?.w1 ?? 0],
                            y: [currentStep?.w2 ?? 0],
                            z: [logTransform(currentStep?.cost ?? 0)],
                            type: 'scatter3d',
                            mode: 'markers',
                            marker: {
                                size: 12,
                                color: '#fff',
                                symbol: 'circle',
                                line: {
                                    color: '#ef4444',
                                    width: 4
                                }
                            },
                            name: t.currentName
                        } as any
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 0, r: 0, b: 0, t: 0 },
                        scene: {
                            xaxis: {
                                title: { text: 'W₁' },
                                gridcolor: 'rgb(255, 255, 255)',
                                zerolinecolor: 'rgb(255, 255, 255)',
                                showbackground: true,
                                backgroundcolor: 'rgb(230, 230,230)'
                            },
                            yaxis: {
                                title: { text: 'W₂' },
                                gridcolor: 'rgb(255, 255, 255)',
                                zerolinecolor: 'rgb(255, 255, 255)',
                                showbackground: true,
                                backgroundcolor: 'rgb(230, 230,230)'
                            },
                            zaxis: {
                                title: { text: t.axisCost },
                                gridcolor: 'rgb(255, 255, 255)',
                                zerolinecolor: 'rgb(255, 255, 255)',
                                showbackground: true,
                                backgroundcolor: 'rgb(230, 230,230)'
                            },
                            camera: {
                                eye: { x: 1.2, y: 0.6, z: 1.2 }
                            }
                        },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        legend: {
                            x: 0,
                            y: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.5)'
                        }
                    }}
                    config={{
                        responsive: true,
                        displayModeBar: true,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d']
                    }}
                    className="w-full h-full"
                    style={{ minHeight: 0 }}
                />
            </div>

            <div className="mt-1 grid grid-cols-3 gap-2 shrink-0">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">{t.statW1}</span>
                    <span className="text-sm font-mono font-bold text-slate-700">{currentStep?.w1?.toFixed(4) ?? "0.0000"}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">{t.statW2}</span>
                    <span className="text-sm font-mono font-bold text-slate-700">{currentStep?.w2?.toFixed(4) ?? "0.0000"}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">{t.statCost}</span>
                    <span className="text-sm font-mono font-bold text-rose-500">{currentStep?.cost?.toFixed(4) ?? "0.0000"}</span>
                </div>
            </div>
        </div>
    );
};

export default Backprop3D;
