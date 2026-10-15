import React, { useMemo } from 'react';
import PlotPanel from './PlotPanel';
import { Stat, Status } from '../ui/Bits';
import Scene3D from '../three/Scene3D';
import Axes3D from '../three/Axes3D';
import { Contours, Surface } from '../three/Surface';
import DescentPath from '../three/DescentPath';
import { KeyLegend, RampLegend } from '../three/Legend';
import { HALF, clamp, costRamp, extent, formatTick, sampleGrid, worldScales } from '../three/scale';
import { useChartTheme } from '../charts/chartTheme';
import { useT } from '../../i18n';
import styles from './Plot3D.module.css';

import type { Step, SurfaceData } from './types';

interface Backprop3DProps {
    surface: SurfaceData | null;
    steps: Step[] | null;
    currentIteration: number;
}

// Log transform to compress high-cost peaks and reveal the valley
const logTransform = (v: number) => Math.log(1 + v);

const CONTOUR_LEVELS = 9;

const Backprop3D: React.FC<Backprop3DProps> = ({ surface, steps, currentIteration }) => {
    const common = useT('common');
    const t = useT('gradient').plots.backprop3d;
    const { palette } = useChartTheme();

    const ramp = useMemo(() => costRamp(palette), [palette]);

    const landscape = useMemo(() => {
        if (!surface?.x || !surface.y || surface.z.length === 0) return null;
        const z = surface.z.map(row => row.map(logTransform));
        const zDomain = extent(z.flat());
        const scales = worldScales(extent(surface.x), extent(surface.y), [Math.max(0, zDomain[0]), zDomain[1]]);
        const [lo, hi] = scales.z.domain;
        const levels = Array.from({ length: CONTOUR_LEVELS }, (_, k) => lo + ((k + 0.5) / CONTOUR_LEVELS) * (hi - lo));
        return { xs: surface.x, ys: surface.y, z, scales, levels };
    }, [surface]);

    // Every step placed on the landscape (sampled from the surface so the ball rolls on it).
    const pathPoints = useMemo(() => {
        if (!landscape || !steps) return [];
        const { xs, ys, z, scales } = landscape;
        return steps.map(s => {
            const w1 = s.w1 ?? 0;
            const w2 = s.w2 ?? 0;
            return [
                clamp(scales.x(w1), -HALF, HALF),
                scales.z(sampleGrid(xs, ys, z, w1, w2)),
                clamp(scales.y(w2), -HALF, HALF),
            ] as [number, number, number];
        });
    }, [landscape, steps]);

    if (!landscape || !steps || steps.length === 0) {
        return (
            <PlotPanel title={t.title} subtitle={t.subtitle}>
                <Status kind="empty" fill>{common.states.noData3d}</Status>
            </PlotPanel>
        );
    }

    const currentStep = steps[currentIteration] || steps[0];
    const { xs, ys, z, scales, levels } = landscape;
    const levelColor = (level: number) => ramp((level - scales.z.domain[0]) / (scales.z.domain[1] - scales.z.domain[0] || 1));

    return (
        <PlotPanel
            title={t.title}
            subtitle={t.subtitle}
            footer={
                <div className={styles.stats}>
                    <Stat label={t.statW1} value={currentStep?.w1?.toFixed(4) ?? "0.0000"} />
                    <Stat label={t.statW2} value={currentStep?.w2?.toFixed(4) ?? "0.0000"} />
                    <Stat label={t.statCost} value={currentStep?.cost?.toFixed(4) ?? "0.0000"} tone="red" />
                </div>
            }
        >
            <Scene3D
                label={t.title}
                legend={
                    <>
                        <RampLegend ramp={ramp} low={common.chart3d.costLow} high={common.chart3d.costHigh} />
                        <KeyLegend
                            items={[
                                { label: t.currentName, color: palette.orange },
                                { label: common.chart3d.nextStep, color: palette.red, shape: 'arrow' },
                                { label: t.pathName, color: palette.orange, shape: 'line' },
                                { label: common.chart3d.start, color: palette.orange, shape: 'ring' },
                            ]}
                        />
                    </>
                }
            >
                <Axes3D
                    scales={scales}
                    x={{ label: 'W₁' }}
                    y={{ label: 'W₂' }}
                    z={{ label: t.axisCost, format: v => formatTick(Math.exp(v) - 1) }}
                />
                <Surface xs={xs} ys={ys} z={z} scales={scales} colorRamp={ramp} opacity={0.94} />
                <Contours xs={xs} ys={ys} z={z} scales={scales} levels={levels} colorFor={levelColor} where="floor" />
                <Contours xs={xs} ys={ys} z={z} scales={scales} levels={levels} colorFor={() => palette.surface} where="surface" lineWidth={1} />
                <DescentPath
                    points={pathPoints}
                    current={currentIteration}
                    color={palette.orange}
                    ballColor={palette.orange}
                    arrowColor={palette.red}
                />
            </Scene3D>
        </PlotPanel>
    );
};

export default Backprop3D;
