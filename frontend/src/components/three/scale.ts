import { interpolateRgbBasis } from "d3";
import type { ChartPalette } from "../charts/chartTheme";

/**
 * Every 3D chart lives in the same world box so camera, lights and labels can be
 * shared: data X → world x ∈ [-1, 1], data Y → world z ∈ [-1, 1] (depth) and the
 * value → world y ∈ [0, HEIGHT] (up). Three.js is Y-up, hence the swap.
 */
export const HALF = 1;
export const HEIGHT = 1.1;

export type Domain = [number, number];

export interface Scale {
    (v: number): number;
    domain: Domain;
}

export function linearScale(domain: Domain, range: [number, number]): Scale {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const span = d1 - d0 || 1;
    const fn = ((v: number) => r0 + ((v - d0) / span) * (r1 - r0)) as Scale;
    fn.domain = domain;
    return fn;
}

export interface WorldScales {
    x: Scale;
    /** Second input, drawn along the depth axis. */
    y: Scale;
    /** Value axis, drawn upwards. */
    z: Scale;
}

export function worldScales(x: Domain, y: Domain, z: Domain): WorldScales {
    return {
        x: linearScale(x, [-HALF, HALF]),
        // Flip depth so +y points away from the default camera, like a standard 3D plot.
        y: linearScale(y, [HALF, -HALF]),
        z: linearScale(z, [0, HEIGHT]),
    };
}

/** [min, max] of the finite values, padded by `pad` × span. */
export function extent(values: Iterable<number>, pad = 0): Domain {
    let lo = Infinity;
    let hi = -Infinity;
    for (const v of values) {
        if (!Number.isFinite(v)) continue;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
    }
    if (lo === Infinity) return [0, 1];
    if (lo === hi) return [lo - 1, hi + 1];
    const p = (hi - lo) * pad;
    return [lo - p, hi + p];
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Bilinear sample of z[j][i] (rows follow ys, columns follow xs) at (x, y); clamps to the grid. */
export function sampleGrid(xs: number[], ys: number[], z: number[][], x: number, y: number): number {
    const fi = fractionalIndex(xs, x);
    const fj = fractionalIndex(ys, y);
    const i0 = Math.floor(fi);
    const j0 = Math.floor(fj);
    const i1 = Math.min(i0 + 1, xs.length - 1);
    const j1 = Math.min(j0 + 1, ys.length - 1);
    const tx = fi - i0;
    const ty = fj - j0;
    const at = (j: number, i: number) => z[j]?.[i] ?? 0;
    const top = at(j0, i0) * (1 - tx) + at(j0, i1) * tx;
    const bottom = at(j1, i0) * (1 - tx) + at(j1, i1) * tx;
    return top * (1 - ty) + bottom * ty;
}

/** Position of `v` in an evenly spaced axis, as a fractional index clamped to [0, n-1]. */
export function fractionalIndex(axis: number[], v: number): number {
    const n = axis.length;
    if (n < 2) return 0;
    const first = axis[0] ?? 0;
    const last = axis[n - 1] ?? 1;
    return clamp(((v - first) / (last - first || 1)) * (n - 1), 0, n - 1);
}

/** Low → high colour ramp: deep indigo valleys rising to warm peaks, built from the palette. */
export function costRamp(palette: ChartPalette): (t: number) => string {
    return interpolateRgbBasis([palette.rampLow, palette.indigo, palette.cyan, palette.green, palette.rampHigh]);
}

/** Two-class ramp for probabilities: class 0 colour at 0, class 1 colour at 1. */
export function probabilityRamp(palette: ChartPalette): (t: number) => string {
    return interpolateRgbBasis([palette.red, palette.neutralMid, palette.indigo]);
}

/** Short tick labels: 12 500 → "12.5k", 0.12345 → "0.12". */
export function formatTick(v: number): string {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `${+(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${+(v / 1_000).toFixed(1)}k`;
    if (abs >= 10 || abs === 0) return `${+v.toFixed(0)}`;
    return `${+v.toFixed(2)}`;
}
