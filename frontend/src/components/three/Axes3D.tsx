import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import { useChartTheme } from "../charts/chartTheme";
import { HALF, HEIGHT, formatTick } from "./scale";
import type { WorldScales } from "./scale";
import { useLabels } from "./labels";
import type { Label3D } from "./labels";

interface AxisSpec {
    label: string;
    format?: ((v: number) => string) | undefined;
}

interface Axes3DProps {
    scales: WorldScales;
    x: AxisSpec;
    y: AxisSpec;
    z: AxisSpec;
}

const GRID_DIVISIONS = 4;
const OFFSET = 0.17;

/** Floor axes show only their ends (the title sits mid-edge); the value axis also gets its midpoint. */
const endsOf = ([d0, d1]: [number, number]) => [d0, d1];
const ticksOf = ([d0, d1]: [number, number]) => [d0, (d0 + d1) / 2, d1];

/**
 * Floor with a light grid, a vertical value axis at the back-left corner and
 * end ticks on the floor axes and min / mid / max on the value axis (published to the scene's label layer).
 */
const Axes3D: React.FC<Axes3DProps> = ({ scales, x, y, z }) => {
    const { palette } = useChartTheme();

    const gridLines = useMemo(() => {
        const lines: [number, number, number][][] = [];
        for (let k = 0; k <= GRID_DIVISIONS; k++) {
            const v = -HALF + (2 * HALF * k) / GRID_DIVISIONS;
            lines.push([[v, 0, -HALF], [v, 0, HALF]]);
            lines.push([[-HALF, 0, v], [HALF, 0, v]]);
        }
        return lines;
    }, []);

    const fx = x.format ?? formatTick;
    const fy = y.format ?? formatTick;
    const fz = z.format ?? formatTick;

    // Keyed on the rendered text, so the label set only changes when what it says changes.
    const xTicks = endsOf(scales.x.domain).map(fx);
    const yTicks = endsOf(scales.y.domain).map(fy);
    const zTicks = ticksOf(scales.z.domain).map(fz);
    const signature = [x.label, y.label, z.label, ...xTicks, ...yTicks, ...zTicks, ...scales.x.domain, ...scales.y.domain, ...scales.z.domain].join("|");

    const labels = useMemo<Label3D[]>(() => {
        const out: Label3D[] = [];
        endsOf(scales.x.domain).forEach((v, k) =>
            out.push({ key: `x${k}`, text: xTicks[k], position: [scales.x(v), 0, HALF + OFFSET] })
        );
        out.push({ key: "xt", text: x.label, variant: "title", position: [0, 0, HALF + OFFSET * 2] });
        endsOf(scales.y.domain).forEach((v, k) =>
            out.push({ key: `y${k}`, text: yTicks[k], position: [HALF + OFFSET, 0, scales.y(v)] })
        );
        out.push({ key: "yt", text: y.label, variant: "title", position: [HALF + OFFSET * 2, 0, 0] });
        ticksOf(scales.z.domain).forEach((v, k) =>
            out.push({ key: `z${k}`, text: zTicks[k], position: [-HALF - OFFSET, scales.z(v), -HALF] })
        );
        out.push({ key: "zt", text: z.label, variant: "title", position: [-HALF, HEIGHT + 0.26, -HALF] });
        return out;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signature]);

    useLabels("axes", labels);

    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
                <planeGeometry args={[2 * HALF, 2 * HALF]} />
                <meshBasicMaterial color={palette.sceneFloor} transparent opacity={0.55} />
            </mesh>
            {gridLines.map((points, k) => (
                <Line key={k} points={points} color={palette.gridLine} lineWidth={1} transparent opacity={0.9} />
            ))}

            {/* Vertical value axis */}
            <Line points={[[-HALF, 0, -HALF], [-HALF, HEIGHT, -HALF]]} color={palette.gridLine} lineWidth={1.5} />
        </group>
    );
};

export default Axes3D;
