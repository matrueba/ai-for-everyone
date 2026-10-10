import React from "react";
import type { NNPlaygroundResponse } from "../../api";
import type { ForwardPass, SelectedNeuron } from "./network";
import { useT } from "../../i18n";

const INDIGO = "#4f46e5";
const ORANGE = "#ea580c";
const CYAN = "#0891b2";
const SLATE = "#94a3b8";

interface NetworkGraphProps {
    net: NNPlaygroundResponse;
    fp: ForwardPass;
    animStep: number | null; // null = todo visible; 1..5 = propagación paso a paso
    selected: SelectedNeuron;
    onSelect: (s: SelectedNeuron) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ net, fp, animStep, selected, onSelect }) => {
    const t = useT("neuralnet").graph;
    const hiddenSize = net.b1.length;

    const WIDTH = 680;
    const HEIGHT = 470;
    const layerX = [110, 350, 590];
    const inputY = [170, 310];
    const hiddenY = (j: number) =>
        hiddenSize > 1 ? 70 + (j * 340) / (hiddenSize - 1) : 240;
    const outputY = 240;
    const R = 25;

    // Opacidad por etapa de animación (1 entrada, 2 conexiones, 3 oculta, 4 conexiones, 5 salida)
    const vis = (stage: number) => (animStep === null || animStep >= stage ? 1 : 0.08);
    const transition = { transition: "opacity 0.5s ease, fill-opacity 0.5s ease" };

    // Normalizaciones para la intensidad visual
    const maxA = Math.max(...fp.hiddenA, 1e-9);
    const maxW1 = Math.max(...net.W1.flat().map(Math.abs), 1e-9);
    const maxW2 = Math.max(...net.W2.map(Math.abs), 1e-9);
    const maxSig1 = Math.max(
        ...net.W1.flatMap((row, i) => row.map((w) => Math.abs(w * (fp.input[i === 0 ? 0 : 1] ?? 0)))),
        1e-9
    );
    const maxSig2 = Math.max(...net.W2.map((w, j) => Math.abs(w * (fp.hiddenA[j] ?? 0))), 1e-9);

    const isSelected = (layer: string, index: number) =>
        selected !== null && selected.layer === layer && selected.index === index;

    const toggleSelect = (s: Exclude<SelectedNeuron, null>) =>
        onSelect(isSelected(s.layer, s.index) ? null : s);

    const selectionRing = (cx: number, cy: number, r: number) => (
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={CYAN} strokeWidth={2.5} strokeDasharray="5 4" />
    );

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full h-auto select-none"
                role="img"
                aria-label={t.ariaLabel}
            >
                {/* Etiquetas de capas */}
                <text x={layerX[0]} y={30} textAnchor="middle" className="fill-slate-500" fontSize={13} fontWeight={700}>
                    {t.layers.input}
                </text>
                <text x={layerX[1]} y={30} textAnchor="middle" className="fill-slate-500" fontSize={13} fontWeight={700}>
                    {t.layers.hidden}
                </text>
                <text x={layerX[2]} y={30} textAnchor="middle" className="fill-slate-500" fontSize={13} fontWeight={700}>
                    {t.layers.output}
                </text>

                {/* Conexiones entrada → oculta */}
                <g style={{ ...transition, opacity: vis(2) }}>
                    {net.W1.map((row, i) =>
                        row.map((w, j) => {
                            const signal = Math.abs(w * (fp.input[i as 0 | 1] ?? 0));
                            return (
                                <line
                                    key={`e1-${i}-${j}`}
                                    x1={(layerX[0] ?? 0) + R}
                                    y1={inputY[i] ?? 0}
                                    x2={(layerX[1] ?? 0) - R}
                                    y2={hiddenY(j)}
                                    stroke={w >= 0 ? INDIGO : ORANGE}
                                    strokeWidth={0.8 + 4 * (Math.abs(w) / maxW1)}
                                    strokeOpacity={0.12 + 0.7 * (signal / maxSig1)}
                                    style={transition}
                                />
                            );
                        })
                    )}
                </g>

                {/* Conexiones oculta → salida */}
                <g style={{ ...transition, opacity: vis(4) }}>
                    {net.W2.map((w, j) => {
                        const signal = Math.abs(w * (fp.hiddenA[j] ?? 0));
                        return (
                            <line
                                key={`e2-${j}`}
                                x1={(layerX[1] ?? 0) + R}
                                y1={hiddenY(j)}
                                x2={(layerX[2] ?? 0) - R - 4}
                                y2={outputY}
                                stroke={w >= 0 ? INDIGO : ORANGE}
                                strokeWidth={0.8 + 4 * (Math.abs(w) / maxW2)}
                                strokeOpacity={0.12 + 0.7 * (signal / maxSig2)}
                                style={transition}
                            />
                        );
                    })}
                </g>

                {/* Neuronas de entrada */}
                <g style={{ ...transition, opacity: vis(1) }}>
                    {fp.input.map((x, i) => {
                        const intensity = Math.min(Math.abs(x) / 3, 1);
                        return (
                            <g
                                key={`in-${i}`}
                                onClick={() => toggleSelect({ layer: "input", index: i })}
                                className="cursor-pointer"
                            >
                                {isSelected("input", i) && selectionRing(layerX[0] ?? 0, inputY[i] ?? 0, R)}
                                <circle
                                    cx={layerX[0]}
                                    cy={inputY[i]}
                                    r={R}
                                    fill={CYAN}
                                    fillOpacity={0.15 + 0.75 * intensity}
                                    stroke={CYAN}
                                    strokeWidth={2}
                                    style={transition}
                                />
                                <text
                                    x={layerX[0]}
                                    y={(inputY[i] ?? 0) + 4.5}
                                    textAnchor="middle"
                                    fontSize={13}
                                    fontWeight={700}
                                    fill={intensity > 0.55 ? "#ffffff" : "#0f172a"}
                                    fontFamily="JetBrains Mono, monospace"
                                >
                                    {x.toFixed(2)}
                                </text>
                                <text
                                    x={(layerX[0] ?? 0) - R - 12}
                                    y={(inputY[i] ?? 0) + 5}
                                    textAnchor="middle"
                                    fontSize={15}
                                    fontWeight={800}
                                    className="fill-slate-600"
                                >
                                    {i === 0 ? "x₁" : "x₂"}
                                </text>
                            </g>
                        );
                    })}
                </g>

                {/* Neuronas ocultas */}
                <g style={{ ...transition, opacity: vis(3) }}>
                    {fp.hiddenA.map((a, j) => {
                        const active = a > 0;
                        const intensity = a / maxA;
                        return (
                            <g
                                key={`h-${j}`}
                                onClick={() => toggleSelect({ layer: "hidden", index: j })}
                                className="cursor-pointer"
                            >
                                {isSelected("hidden", j) && selectionRing(layerX[1] ?? 0, hiddenY(j), R)}
                                <circle
                                    cx={layerX[1]}
                                    cy={hiddenY(j)}
                                    r={R}
                                    fill={active ? INDIGO : "#f1f5f9"}
                                    fillOpacity={active ? 0.2 + 0.8 * intensity : 1}
                                    stroke={active ? INDIGO : SLATE}
                                    strokeWidth={2}
                                    strokeDasharray={active ? undefined : "4 3"}
                                    style={{
                                        ...transition,
                                        filter: active && intensity > 0.5 ? "drop-shadow(0 0 6px rgba(79,70,229,0.55))" : undefined,
                                    }}
                                />
                                <text
                                    x={layerX[1]}
                                    y={hiddenY(j) + 4.5}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fontWeight={700}
                                    fill={active && intensity > 0.5 ? "#ffffff" : active ? "#312e81" : "#94a3b8"}
                                    fontFamily="JetBrains Mono, monospace"
                                >
                                    {a.toFixed(2)}
                                </text>
                                {!active && (
                                    <text
                                        x={(layerX[1] ?? 0) + R + 8}
                                        y={hiddenY(j) + 4}
                                        fontSize={9.5}
                                        className="fill-slate-400"
                                        fontStyle="italic"
                                    >
                                        {t.inactive}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>

                {/* Neurona de salida */}
                <g style={{ ...transition, opacity: vis(5) }}>
                    <g onClick={() => toggleSelect({ layer: "output", index: 0 })} className="cursor-pointer">
                        {isSelected("output", 0) && selectionRing(layerX[2] ?? 0, outputY, R + 4)}
                        <circle
                            cx={layerX[2]}
                            cy={outputY}
                            r={R + 4}
                            fill={fp.outputA >= 0.5 ? INDIGO : ORANGE}
                            fillOpacity={0.25 + 0.75 * Math.abs(fp.outputA - 0.5) * 2}
                            stroke={fp.outputA >= 0.5 ? INDIGO : ORANGE}
                            strokeWidth={2.5}
                            style={{
                                ...transition,
                                filter:
                                    Math.abs(fp.outputA - 0.5) > 0.3
                                        ? `drop-shadow(0 0 8px ${fp.outputA >= 0.5 ? "rgba(79,70,229,0.5)" : "rgba(234,88,12,0.5)"})`
                                        : undefined,
                            }}
                        />
                        <text
                            x={layerX[2]}
                            y={outputY + 5}
                            textAnchor="middle"
                            fontSize={14}
                            fontWeight={800}
                            fill={Math.abs(fp.outputA - 0.5) * 2 > 0.4 ? "#ffffff" : "#0f172a"}
                            fontFamily="JetBrains Mono, monospace"
                        >
                            {(fp.outputA * 100).toFixed(0)}%
                        </text>
                        <text
                            x={layerX[2]}
                            y={outputY + R + 24}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={700}
                            fill={fp.outputA >= 0.5 ? INDIGO : ORANGE}
                        >
                            {fp.outputA >= 0.5 ? t.inside : t.outside}
                        </text>
                    </g>
                </g>
            </svg>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 text-[0.7rem] text-slate-500">
                <span className="flex items-center gap-2">
                    <span className="inline-block w-6 h-[3px] rounded" style={{ background: INDIGO }} />
                    {t.legend.positive}
                </span>
                <span className="flex items-center gap-2">
                    <span className="inline-block w-6 h-[3px] rounded" style={{ background: ORANGE }} />
                    {t.legend.negative}
                </span>
                <span>{t.legend.thickness}</span>
                <span className="italic">{t.legend.hint}</span>
            </div>
        </div>
    );
};

export default NetworkGraph;
