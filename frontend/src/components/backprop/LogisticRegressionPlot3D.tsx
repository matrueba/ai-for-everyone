import React, { useMemo } from 'react';
import PlotPanel, { Readout } from './PlotPanel';
import { Status } from '../ui/Bits';
import Scene3D from '../three/Scene3D';
import Axes3D from '../three/Axes3D';
import { Contours, Surface } from '../three/Surface';
import { Points } from '../three/Points';
import { KeyLegend, RampLegend } from '../three/Legend';
import { extent, probabilityRamp, worldScales } from '../three/scale';
import { useChartTheme } from '../charts/chartTheme';
import { useT } from '../../i18n';
import { EQUATION } from './chartStyles';

import type { PlotData, Step } from './types';

interface LogisticRegressionPlot3DProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + step * i);
};

const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));

const EMPTY: number[] = [];
const SURFACE_RES = 40;
const BOUNDARY = [0.5];

const LogisticRegressionPlot3D: React.FC<LogisticRegressionPlot3DProps> = ({ data, currentStep }) => {
    const common = useT('common');
    const t = useT('gradient').plots.logistic3d;
    const { palette } = useChartTheme();

    const x1 = data?.x1 ?? EMPTY;
    const x2 = data?.x2 ?? EMPTY;
    const y = data?.y ?? EMPTY;
    const { w1 = 0, w2 = 0, b = 0 } = currentStep ?? {};

    const ramp = useMemo(() => probabilityRamp(palette), [palette]);
    const scales = useMemo(() => worldScales(extent(x1), extent(x2), [0, 1]), [x1, x2]);

    // Sigmoid surface: height and colour are the predicted probability of class 1.
    const surface = useMemo(() => {
        const xs = linspace(...scales.x.domain, SURFACE_RES);
        const ys = linspace(...scales.y.domain, SURFACE_RES);
        const z = ys.map(x2Val => xs.map(x1Val => sigmoid(w1 * x1Val + w2 * x2Val + b)));
        return { xs, ys, z };
    }, [scales, w1, w2, b]);

    if (!data || !currentStep) {
        return (
            <PlotPanel title={t.title} subtitle={t.subtitle}>
                <Status kind="empty" fill>{common.states.noData}</Status>
            </PlotPanel>
        );
    }

    const { iteration, cost } = currentStep;

    return (
        <PlotPanel
            title={t.title}
            subtitle={t.subtitle}
            actions={
                <>
                    <Readout label={t.iteration} value={iteration} />
                    <Readout label={t.logLoss} value={cost?.toFixed(4)} tone="red" />
                </>
            }
            footer={
                <code className={EQUATION}>
                    {t.footerLabel}: P(y=1) = σ({w1?.toFixed(2)}·{t.formulaVars.hours} {w2 >= 0 ? '+' : ''} {w2?.toFixed(2)}·{t.formulaVars.score} {b >= 0 ? '+' : ''} {b?.toFixed(2)})
                </code>
            }
        >
            <Scene3D
                label={t.title}
                legend={
                    <>
                        <RampLegend ramp={ramp} low="P = 0" high="P = 1" />
                        <KeyLegend
                            items={[
                                { label: `${t.studentsName} · y = 1`, color: palette.indigo },
                                { label: `${t.studentsName} · y = 0`, color: palette.red },
                                { label: common.chart3d.boundary, color: palette.textStrong, shape: 'line' },
                            ]}
                        />
                    </>
                }
            >
                <Axes3D scales={scales} x={{ label: t.xLabel }} y={{ label: t.yLabel }} z={{ label: t.zLabel }} />
                <Points x={x1} y={x2} z={y} scales={scales} color={i => ((y[i] ?? 0) === 1 ? palette.indigo : palette.red)} />
                <Surface xs={surface.xs} ys={surface.ys} z={surface.z} scales={scales} colorRamp={ramp} opacity={0.72} />
                <Contours
                    xs={surface.xs}
                    ys={surface.ys}
                    z={surface.z}
                    scales={scales}
                    levels={BOUNDARY}
                    colorFor={() => palette.textStrong}
                    lineWidth={2.2}
                />
            </Scene3D>
        </PlotPanel>
    );
};

export default LogisticRegressionPlot3D;
