import React, { useCallback, useMemo } from 'react';
import PlotPanel, { Readout } from './PlotPanel';
import { Status } from '../ui/Bits';
import Scene3D from '../three/Scene3D';
import Axes3D from '../three/Axes3D';
import { Surface } from '../three/Surface';
import { Points, Residuals } from '../three/Points';
import { KeyLegend } from '../three/Legend';
import { extent, worldScales } from '../three/scale';
import { useChartTheme } from '../charts/chartTheme';
import { useT } from '../../i18n';
import { EQUATION } from './chartStyles';

import type { PlotData, Step } from './types';

interface RegressionPlot3DProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const linspace = (start: number, stop: number, num: number) => {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + step * i);
};

const EMPTY: number[] = [];
const PLANE_RES = 13;

const RegressionPlot3D: React.FC<RegressionPlot3DProps> = ({ data, currentStep }) => {
    const common = useT('common');
    const t = useT('gradient').plots.regression3d;
    const { palette } = useChartTheme();

    const x1 = data?.x1 ?? EMPTY;
    const x2 = data?.x2 ?? EMPTY;
    const y = data?.y ?? EMPTY;
    const { w1 = 0, w2 = 0, b = 0 } = currentStep ?? {};

    // The box is fixed by the data, so the plane visibly moves into place as training advances.
    const scales = useMemo(() => worldScales(extent(x1), extent(x2), extent(y, 0.15)), [x1, x2, y]);

    const plane = useMemo(() => {
        const xs = linspace(...scales.x.domain, PLANE_RES);
        const ys = linspace(...scales.y.domain, PLANE_RES);
        const z = ys.map(x2Val => xs.map(x1Val => w1 * x1Val + w2 * x2Val + b));
        return { xs, ys, z };
    }, [scales, w1, w2, b]);

    const predict = useCallback((i: number) => w1 * (x1[i] ?? 0) + w2 * (x2[i] ?? 0) + b, [w1, w2, b, x1, x2]);

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
                    <Readout label={`${t.iteration}:`} value={iteration} />
                    <Readout label={`${t.cost}:`} value={cost?.toFixed(4)} tone="red" />
                </>
            }
            footer={
                <code className={EQUATION}>
                    {t.fitted} {t.formulaVars.price} = {w1?.toFixed(2)}·{t.formulaVars.area} {w2 >= 0 ? '+' : ''} {w2?.toFixed(2)}·{t.formulaVars.location} {b >= 0 ? '+' : ''} {b?.toFixed(2)}
                </code>
            }
        >
            <Scene3D
                label={t.title}
                legend={
                    <KeyLegend
                        items={[
                            { label: t.dataName, color: palette.indigo },
                            { label: t.planeName, color: palette.orange, shape: 'line' },
                            { label: common.chart3d.residuals, color: palette.red, shape: 'line' },
                        ]}
                    />
                }
            >
                <Axes3D scales={scales} x={{ label: t.xLabel }} y={{ label: t.yLabel }} z={{ label: t.zLabel }} />
                <Points x={x1} y={x2} z={y} scales={scales} color={palette.indigo} />
                <Residuals x={x1} y={x2} z={y} predict={predict} scales={scales} color={palette.red} />
                <Surface
                    xs={plane.xs}
                    ys={plane.ys}
                    z={plane.z}
                    scales={scales}
                    color={palette.orange}
                    opacity={0.32}
                    wireEvery={2}
                    wireColor={palette.orange}
                    clip
                />
            </Scene3D>
        </PlotPanel>
    );
};

export default RegressionPlot3D;
