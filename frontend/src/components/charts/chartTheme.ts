import { useTheme } from "../../theme";
import type { ResolvedTheme } from "../../theme";

/**
 * Concrete colours for WebGL materials and SVG presentation attributes, which
 * can't read CSS variables. Mirrors `styles/tokens.css`; d3 charts use the CSS
 * variables directly instead.
 */
export interface ChartPalette {
    textStrong: string;
    text: string;
    textMuted: string;
    surface: string;
    sceneFloor: string;
    gridLine: string;
    indigo: string;
    purple: string;
    cyan: string;
    orange: string;
    green: string;
    red: string;
    data: string;
    muted: string;
    /** Ends of the cost colour ramp. */
    rampLow: string;
    rampHigh: string;
    /** Middle of the probability ramp (p ≈ 0.5). */
    neutralMid: string;
}

const PALETTES: Record<ResolvedTheme, ChartPalette> = {
    light: {
        textStrong: "#0f172a",
        text: "#334155",
        textMuted: "#64748b",
        surface: "#ffffff",
        sceneFloor: "#e2e8f0",
        gridLine: "#cbd5e1",
        indigo: "#4f46e5",
        purple: "#7c3aed",
        cyan: "#0891b2",
        orange: "#ea580c",
        green: "#059669",
        red: "#dc2626",
        data: "#64748b",
        muted: "#94a3b8",
        rampLow: "#3730a3",
        rampHigh: "#fcd34d",
        neutralMid: "#e2e8f0",
    },
    dark: {
        textStrong: "#f1f5f9",
        text: "#cbd5e1",
        textMuted: "#94a3b8",
        surface: "#111a2e",
        sceneFloor: "#17223a",
        gridLine: "#2a3857",
        indigo: "#818cf8",
        purple: "#a78bfa",
        cyan: "#22d3ee",
        orange: "#fb923c",
        green: "#34d399",
        red: "#f87171",
        data: "#94a3b8",
        muted: "#64748b",
        rampLow: "#4338ca",
        rampHigh: "#fde68a",
        neutralMid: "#475569",
    },
};

/** Theme-aware palette for charts that need literal colours. */
export function useChartTheme() {
    const { theme } = useTheme();
    return { theme, palette: PALETTES[theme] };
}
