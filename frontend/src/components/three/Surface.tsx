import React, { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { contours } from "d3";
import { HALF, HEIGHT, clamp } from "./scale";
import type { WorldScales } from "./scale";

/** Clipping planes that keep a surface inside the world box (planes and sigmoids can overshoot it). */
export const BOX_CLIP = [
    new THREE.Plane(new THREE.Vector3(0, -1, 0), HEIGHT + 0.001),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.001),
];

interface SurfaceProps {
    /** Grid axes: xs along columns, ys along rows; z[j][i] is the value at (xs[i], ys[j]). */
    xs: number[];
    ys: number[];
    z: number[][];
    scales: WorldScales;
    /** Colour per vertex from the value normalised to [0, 1] within the z domain… */
    colorRamp?: ((t: number) => string) | undefined;
    /** …or one flat colour. */
    color?: string | undefined;
    opacity?: number | undefined;
    /** Faint grid drawn on the surface every `wireEvery` samples (0 = none). */
    wireEvery?: number | undefined;
    wireColor?: string | undefined;
    /** Clip to the world box instead of letting the mesh stick out. */
    clip?: boolean | undefined;
}

/** Height field mesh built straight from the grid the backend (or the component) computes. */
export const Surface: React.FC<SurfaceProps> = ({
    xs,
    ys,
    z,
    scales,
    colorRamp,
    color,
    opacity = 1,
    wireEvery = 0,
    wireColor = "#ffffff",
    clip = false,
}) => {
    const geometry = useMemo(() => {
        const nx = xs.length;
        const ny = ys.length;
        const positions = new Float32Array(nx * ny * 3);
        const colors = new Float32Array(nx * ny * 3);
        const [z0, z1] = scales.z.domain;
        const c = new THREE.Color();

        for (let j = 0; j < ny; j++) {
            for (let i = 0; i < nx; i++) {
                const v = z[j]?.[i] ?? 0;
                const k = (j * nx + i) * 3;
                positions[k] = scales.x(xs[i] ?? 0);
                positions[k + 1] = scales.z(v);
                positions[k + 2] = scales.y(ys[j] ?? 0);
                if (colorRamp) {
                    c.set(colorRamp(clamp((v - z0) / (z1 - z0 || 1), 0, 1)));
                    colors[k] = c.r;
                    colors[k + 1] = c.g;
                    colors[k + 2] = c.b;
                }
            }
        }

        const indices: number[] = [];
        for (let j = 0; j < ny - 1; j++) {
            for (let i = 0; i < nx - 1; i++) {
                const a = j * nx + i;
                const b = a + 1;
                const d = a + nx;
                const e = d + 1;
                indices.push(a, d, b, b, d, e);
            }
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        if (colorRamp) g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        g.setIndex(indices);
        g.computeVertexNormals();
        return g;
    }, [xs, ys, z, scales, colorRamp]);

    const wire = useMemo(() => {
        if (!wireEvery) return [];
        const lines: [number, number, number][][] = [];
        const point = (i: number, j: number): [number, number, number] => [
            scales.x(xs[i] ?? 0),
            scales.z(z[j]?.[i] ?? 0) + 0.002,
            scales.y(ys[j] ?? 0),
        ];
        for (let j = 0; j < ys.length; j += wireEvery) lines.push(xs.map((_, i) => point(i, j)));
        for (let i = 0; i < xs.length; i += wireEvery) lines.push(ys.map((_, j) => point(i, j)));
        return lines;
    }, [wireEvery, xs, ys, z, scales]);

    const translucent = opacity < 1;

    return (
        <group>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    vertexColors={Boolean(colorRamp)}
                    color={colorRamp ? "#ffffff" : (color ?? "#ffffff")}
                    side={THREE.DoubleSide}
                    roughness={0.55}
                    metalness={0.05}
                    transparent={translucent}
                    opacity={opacity}
                    depthWrite={!translucent}
                    clippingPlanes={clip ? BOX_CLIP : null}
                    polygonOffset
                    polygonOffsetFactor={1}
                />
            </mesh>
            {wire.map((points, k) => (
                <Line
                    key={k}
                    points={points}
                    color={wireColor}
                    lineWidth={0.8}
                    transparent
                    opacity={0.35}
                    clippingPlanes={clip ? BOX_CLIP : []}
                />
            ))}
        </group>
    );
};

interface ContoursProps {
    xs: number[];
    ys: number[];
    z: number[][];
    scales: WorldScales;
    /** Values at which to draw iso-lines. */
    levels: number[];
    colorFor: (level: number) => string;
    /** Draw on the floor (projection), on the surface itself, or both. */
    where?: "floor" | "surface" | "both" | undefined;
    lineWidth?: number | undefined;
}

/** Iso-lines of the grid (d3-contour), projected on the floor and/or traced on the surface. */
export const Contours: React.FC<ContoursProps> = ({ xs, ys, z, scales, levels, colorFor, where = "both", lineWidth = 1.2 }) => {
    const rings = useMemo(() => {
        const nx = xs.length;
        const ny = ys.length;
        if (nx < 2 || ny < 2) return [];
        const values = new Array<number>(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) values[j * nx + i] = z[j]?.[i] ?? 0;

        // d3-contour places sample (i, j) at pixel centre (i + 0.5, j + 0.5).
        const x0 = xs[0] ?? 0;
        const dx = ((xs[nx - 1] ?? 1) - x0) / (nx - 1);
        const y0 = ys[0] ?? 0;
        const dy = ((ys[ny - 1] ?? 1) - y0) / (ny - 1);
        const toX = (c: number) => x0 + clamp(c - 0.5, 0, nx - 1) * dx;
        const toY = (c: number) => y0 + clamp(c - 0.5, 0, ny - 1) * dy;

        const out: { level: number; points: [number, number][] }[] = [];
        for (const geo of contours().size([nx, ny]).thresholds(levels)(values)) {
            for (const polygon of geo.coordinates) {
                for (const ring of polygon) {
                    // Points on the grid border belong to the clip edge, not to the iso-line:
                    // split the ring there so separate pieces are not joined across the plot.
                    let run: [number, number][] = [];
                    const flush = () => {
                        if (run.length > 1) out.push({ level: geo.value, points: run });
                        run = [];
                    };
                    for (const point of ring) {
                        const cx = point[0] ?? 0;
                        const cy = point[1] ?? 0;
                        const inside = cx > 0.5 && cx < nx - 0.5 && cy > 0.5 && cy < ny - 0.5;
                        if (inside) run.push([toX(cx), toY(cy)]);
                        else flush();
                    }
                    flush();
                }
            }
        }
        return out;
    }, [xs, ys, z, levels]);

    return (
        <group>
            {rings.map(({ level, points }, k) => (
                <React.Fragment key={k}>
                    {(where === "floor" || where === "both") && (
                        <Line
                            points={points.map(([x, y]) => [scales.x(x), 0.003, scales.y(y)] as [number, number, number])}
                            color={colorFor(level)}
                            lineWidth={lineWidth}
                            transparent
                            opacity={0.85}
                        />
                    )}
                    {(where === "surface" || where === "both") && (
                        <Line
                            points={points.map(([x, y]) => [scales.x(x), scales.z(level) + 0.004, scales.y(y)] as [number, number, number])}
                            color={colorFor(level)}
                            lineWidth={lineWidth * 0.8}
                            transparent
                            opacity={0.5}
                        />
                    )}
                </React.Fragment>
            ))}
        </group>
    );
};
