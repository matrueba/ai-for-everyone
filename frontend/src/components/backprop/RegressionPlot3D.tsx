import React, { useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponentModule from 'react-plotly.js/factory';

const createPlotlyComponent = (createPlotlyComponentModule as any).default || createPlotlyComponentModule;
const Plot = createPlotlyComponent(Plotly);

import { useT } from '../../i18n';

import type { PlotData, Step } from './types';

interface RegressionPlot3DProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + step * i);
};

const RegressionPlot3D: React.FC<RegressionPlot3DProps> = ({ data, currentStep }) => {
    const common = useT('common');
    const t = useT('gradient').plots.regression3d;

    if (!data || !currentStep) return (
        <div className="flex items-center justify-center h-full bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            {common.states.noData}
        </div>
    );

    const { x1 = [], x2 = [], y = [] } = data;
    const { w1 = 0, w2 = 0, b = 0, iteration, cost } = currentStep;

    // Generate plane data
    const planeData = useMemo(() => {
        const x1Min = Math.min(...(x1.length ? x1 : [0]));
        const x1Max = Math.max(...(x1.length ? x1 : [1]));
        const x2Min = Math.min(...(x2.length ? x2 : [0]));
        const x2Max = Math.max(...(x2.length ? x2 : [1]));

        const x1Range = linspace(x1Min, x1Max, 20);
        const x2Range = linspace(x2Min, x2Max, 20);

        const zPlane = x2Range.map(x2Val =>
            x1Range.map(x1Val => w1 * x1Val + w2 * x2Val + b)
        );

        return { x: x1Range, y: x2Range, z: zPlane };
    }, [x1, x2, w1, w2, b]);

    return (
        <div className="card-elevated p-3 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
                <div>
                    <h3 className="text-base font-bold text-slate-800">{t.title}</h3>
                    <p className="text-xs text-slate-500">{t.subtitle}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-medium text-slate-600 block">{t.iteration}: <span className="font-mono text-indigo-600">{iteration}</span></span>
                    <span className="text-xs font-medium text-slate-600 block">{t.cost}: <span className="font-mono text-rose-500">{cost?.toFixed(4)}</span></span>
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
                                color: '#6366f1',
                                opacity: 0.8
                            },
                            name: t.dataName
                        } as any,
                        // The fitted regression plane
                        {
                            x: planeData.x,
                            y: planeData.y,
                            z: planeData.z,
                            type: 'surface',
                            colorscale: [
                                [0, 'rgba(239, 68, 68, 0.4)'], // Reddish translucent
                                [1, 'rgba(239, 68, 68, 0.4)']
                            ],
                            showscale: false,
                            opacity: 0.6,
                            contours: {
                                z: { show: true, usecolormap: true, highlightcolor: "white", project: { z: false } },
                                x: { show: true, color: "white", width: 1 },
                                y: { show: true, color: "white", width: 1 }
                            },
                            name: t.planeName,
                            hoverinfo: 'none'
                        } as any
                    ]}
                    layout={{
                        autosize: true,
                        margin: { l: 0, r: 0, b: 0, t: 0 },
                        scene: {
                            xaxis: {
                                title: { text: t.xLabel },
                                gridcolor: 'white',
                                showbackground: true,
                                backgroundcolor: 'rgb(248, 250, 252)'
                            },
                            yaxis: {
                                title: { text: t.yLabel },
                                gridcolor: 'white',
                                showbackground: true,
                                backgroundcolor: 'rgb(248, 250, 252)'
                            },
                            zaxis: {
                                title: { text: t.zLabel },
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
                    className="w-full h-full"
                    style={{ minHeight: 0 }}
                />
            </div>

            <div className="mt-1 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-slate-600">{t.fitted}</span>
                <span className="text-xs font-mono font-bold text-indigo-600">
                    {t.formulaVars.price} = {w1?.toFixed(2)}·{t.formulaVars.area} {w2 >= 0 ? '+' : ''} {w2?.toFixed(2)}·{t.formulaVars.location} {b >= 0 ? '+' : ''} {b?.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default RegressionPlot3D;
