import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { WorldScales } from "./scale";

interface PointsProps {
    x: number[];
    y: number[];
    z: number[];
    scales: WorldScales;
    /** One colour for all points, or one per point. */
    color: string | ((index: number) => string);
    size?: number | undefined;
    opacity?: number | undefined;
}

const tmp = new THREE.Object3D();
const tmpColor = new THREE.Color();

/** Data points as one instanced mesh of small spheres (cheap even for hundreds of points). */
export const Points: React.FC<PointsProps> = ({ x, y, z, scales, color, size = 0.028, opacity = 0.9 }) => {
    const ref = useRef<THREE.InstancedMesh>(null);
    const count = Math.min(x.length, y.length, z.length);

    useLayoutEffect(() => {
        const mesh = ref.current;
        if (!mesh) return;
        for (let i = 0; i < count; i++) {
            tmp.position.set(scales.x(x[i] ?? 0), scales.z(z[i] ?? 0), scales.y(y[i] ?? 0));
            tmp.updateMatrix();
            mesh.setMatrixAt(i, tmp.matrix);
            mesh.setColorAt(i, tmpColor.set(typeof color === "string" ? color : color(i)));
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [x, y, z, scales, color, count]);

    return (
        <instancedMesh key={count} ref={ref} args={[undefined, undefined, count]}>
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial roughness={0.4} transparent={opacity < 1} opacity={opacity} />
        </instancedMesh>
    );
};

interface ResidualsProps {
    x: number[];
    y: number[];
    z: number[];
    /** Model prediction for point i (the other end of the residual). */
    predict: (i: number) => number;
    scales: WorldScales;
    color: string;
}

/** Vertical segments from each point to the model: the errors the cost function adds up. */
export const Residuals: React.FC<ResidualsProps> = ({ x, y, z, predict, scales, color }) => {
    const segments = useMemo(() => {
        const pts: [number, number, number][] = [];
        const n = Math.min(x.length, y.length, z.length);
        const [lo, hi] = scales.z.domain;
        for (let i = 0; i < n; i++) {
            const wx = scales.x(x[i] ?? 0);
            const wy = scales.y(y[i] ?? 0);
            const p = Math.min(hi, Math.max(lo, predict(i)));
            pts.push([wx, scales.z(z[i] ?? 0), wy], [wx, scales.z(p), wy]);
        }
        return pts;
    }, [x, y, z, predict, scales]);

    if (segments.length === 0) return null;
    return <Line points={segments} segments color={color} lineWidth={1} transparent opacity={0.45} />;
};
