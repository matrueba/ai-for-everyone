import React, { useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponentModule from 'react-plotly.js/factory';

const createPlotlyComponent = (createPlotlyComponentModule as any).default || createPlotlyComponentModule;
const Plot = createPlotlyComponent(Plotly);

import type { PlotData, Step } from './types';

interface LogisticRegressionPlot3DProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + step * i);
};

const LogisticRegressionPlot3D: React.FC<LogisticRegressionPlot3DProps> = ({ data, currentStep }) => {
    if (!data || !currentStep) return (
        <div className="flex items-center justify-center h-[500px] bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            No data available
        </div>
    );

    const { x1 = [], x2 = [], y = [] } = data;
    const { w1 = 0, w2 = 0, b = 0, iteration, cost } = currentStep;

    // Generate sigmoid surface data
    const surfaceData = useMemo(() => {
        const x1Min = Math.min(...(x1.length ? x1 : [0]));
        const x1Max = Math.max(...(x1.length ? x1 : [1]));
        const x2Min = Math.min(...(x2.length ? x2 : [0]));
        const x2Max = Math.max(...(x2.length ? x2 : [1]));

        const x1Range = linspace(x1Min, x1Max, 30);
        const x2Range = linspace(x2Min, x2Max, 30);

        const zSurface = x2Range.map(x2Val =>
            x1Range.map(x1Val => {
                const z = w1 * x1Val + w2 * x2Val + b;
                const zClipped = Math.max(-50, Math.min(50, z)); // prevent overflow
                return 1 / (1 + Math.exp(-zClipped));
            })
        );

        return { x: x1Range, y: x2Range, z: zSurface };
    }, [x1, x2, w1, w2, b]);

    return (
        <div className="card-elevated p-3 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
                <div>
                    <h3 className="text-base font-bold text-slate-800">Predicción de Admisión 3D</h3>
                    <p className="text-xs text-slate-500">Probabilidad de ser admitido (Sí/No)</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-medium text-slate-600 block">Iteration: <span className="font-mono text-indigo-600">{iteration}</span></span>
                    <span className="text-xs font-medium text-slate-600 block">Log Loss: <span className="font-mono text-rose-500">{cost?.toFixed(4)}</span></span>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden rounded-xl bg-slate-50/50 min-h-0 p-1">
                <Plot
                    data={[
                        // The actual dataset scatter points
                        {
                            x: x1,
                            y: x2,
                            z: y,
                            type: 'scatter3d',
                            mode: 'markers',
                            marker: {
                                size: 4,
                                color: y.map(val => val === 1 ? '#6366f1' : '#ef4444'),
                                opacity: 0.8
                            },
                            name: 'Estudiantes'
                        } as any,
                        // The fitted sigmoid surface
                        {
                            x: surfaceData.x,
                            y: surfaceData.y,
                            z: surfaceData.z,
                            type: 'surface',
                            colorscale: [
                                [0, 'rgba(239, 68, 68, 0.6)'],   // Red for lower probabilities
                                [0.5, 'rgba(255, 255, 255, 0.4)'], // Whiteish for border
                                [1, 'rgba(99, 102, 241, 0.6)']   // Indigo for higher probabilities
                            ],
                            showscale: false,
                            opacity: 0.8,
                            contours: {
                                z: {
                                    show: true,
                                    usecolormap: true,
                                    highlightcolor: "white",
                                    project: { z: true } // project to base
                                },
                                x: { show: false },
                                y: { show: false }
                            },
                            name: 'Probabilidad (Sigmoide)',
                            hoverinfo: 'none'
                        } as any
                    ]}
                    layout={{
                        autosize: true,
                        height: 500,
                        margin: { l: 0, r: 0, b: 0, t: 0 },
                        scene: {
                            xaxis: {
                                title: 'Horas Estudio (x₁)',
                                gridcolor: 'white',
                                showbackground: true,
                                backgroundcolor: 'rgb(248, 250, 252)'
                            },
                            yaxis: {
                                title: 'Examen Ingreso (x₂)',
                                gridcolor: 'white',
                                showbackground: true,
                                backgroundcolor: 'rgb(248, 250, 252)'
                            },
                            zaxis: {
                                title: 'Prob. Admisión P(y=1)',
                                range: [-0.1, 1.1],
                                gridcolor: 'white',
                                showbackground: true,
                                backgroundcolor: 'rgb(241, 245, 249)'
                            },
                            camera: {
                                eye: { x: 1.5, y: 1.5, z: 1.2 }
                            }
                        },
                        showlegend: true,
                        legend: {
                            x: 0,
                            y: 1
                        }
                    }}
                    config={{
                        displayModeBar: false,
                        responsive: true
                    }}
                    className="w-full"
                />
            </div>

            <div className="mt-1 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-slate-600">Función Probabilidad Admisión</span>
                <span className="text-xs font-mono font-bold text-indigo-600 whitespace-nowrap overflow-x-auto ml-4">
                    P(y=1) = σ({w1?.toFixed(2)}·horas {w2 >= 0 ? '+' : ''} {w2?.toFixed(2)}·nota {b >= 0 ? '+' : ''} {b?.toFixed(2)})
                </span>
            </div>
        </div>
    );
};

export default LogisticRegressionPlot3D;
