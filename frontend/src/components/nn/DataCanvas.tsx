import React, { useMemo, useRef } from "react";
import type { NNPlaygroundResponse } from "../../api";
import { forward } from "./network";

const INDIGO = "#4f46e5";
const ORANGE = "#ea580c";

const SIZE = 280;
const DOMAIN = 3; // los datos viven en [-3, 3] x [-3, 3]

const toPx = (v: number) => ((v + DOMAIN) / (2 * DOMAIN)) * SIZE;
const toPy = (v: number) => ((DOMAIN - v) / (2 * DOMAIN)) * SIZE;

interface DataCanvasProps {
    net: NNPlaygroundResponse;
    x1: number;
    x2: number;
    onChange: (x1: number, x2: number) => void;
}

const DataCanvas: React.FC<DataCanvasProps> = ({ net, x1, x2, onChange }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const dragging = useRef(false);

    // Mapa de decisión de la red (se calcula una vez por red, no por movimiento)
    const heatmap = useMemo(() => {
        const cells: { x: number; y: number; p: number }[] = [];
        const n = 26;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cx = -DOMAIN + ((i + 0.5) * 2 * DOMAIN) / n;
                const cy = -DOMAIN + ((j + 0.5) * 2 * DOMAIN) / n;
                cells.push({ x: cx, y: cy, p: forward(net, cx, cy).outputA });
            }
        }
        return { cells, cellPx: SIZE / n };
    }, [net]);

    const updateFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const px = ((e.clientX - rect.left) / rect.width) * SIZE;
        const py = ((e.clientY - rect.top) / rect.height) * SIZE;
        const nx = Math.max(-DOMAIN, Math.min(DOMAIN, (px / SIZE) * 2 * DOMAIN - DOMAIN));
        const ny = Math.max(-DOMAIN, Math.min(DOMAIN, DOMAIN - (py / SIZE) * 2 * DOMAIN));
        onChange(Math.round(nx * 100) / 100, Math.round(ny * 100) / 100);
    };

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full h-auto rounded-xl border border-slate-200 bg-white cursor-crosshair touch-none"
            onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                updateFromPointer(e);
            }}
            onPointerMove={(e) => {
                if (dragging.current) updateFromPointer(e);
            }}
            onPointerUp={() => {
                dragging.current = false;
            }}
            role="img"
            aria-label="Espacio de entrada: arrastra el punto para cambiar x1 y x2"
        >
            {/* Región de decisión aprendida por la red */}
            {heatmap.cells.map((c, k) => (
                <rect
                    key={k}
                    x={toPx(c.x) - heatmap.cellPx / 2}
                    y={toPy(c.y) - heatmap.cellPx / 2}
                    width={heatmap.cellPx + 0.5}
                    height={heatmap.cellPx + 0.5}
                    fill={c.p >= 0.5 ? INDIGO : ORANGE}
                    opacity={Math.abs(c.p - 0.5) * 0.28}
                />
            ))}

            {/* Frontera real del problema (círculo) */}
            <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={(net.radius / (2 * DOMAIN)) * SIZE}
                fill="none"
                stroke="#64748b"
                strokeWidth={1.2}
                strokeDasharray="5 4"
                opacity={0.6}
            />

            {/* Ejes */}
            <line x1={SIZE / 2} y1={0} x2={SIZE / 2} y2={SIZE} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={0} y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} stroke="#e2e8f0" strokeWidth={1} />

            {/* Datos de entrenamiento */}
            {net.data.x1.map((dx, i) => (
                <circle
                    key={`d-${i}`}
                    cx={toPx(dx)}
                    cy={toPy(net.data.x2[i] ?? 0)}
                    r={3}
                    fill={(net.data.label[i] ?? 0) > 0.5 ? INDIGO : ORANGE}
                    opacity={0.55}
                />
            ))}

            {/* Punto de entrada actual */}
            <line x1={toPx(x1)} y1={toPy(x2) - 14} x2={toPx(x1)} y2={toPy(x2) + 14} stroke="#0f172a" strokeWidth={1} opacity={0.4} />
            <line x1={toPx(x1) - 14} y1={toPy(x2)} x2={toPx(x1) + 14} y2={toPy(x2)} stroke="#0f172a" strokeWidth={1} opacity={0.4} />
            <circle
                cx={toPx(x1)}
                cy={toPy(x2)}
                r={8}
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth={2.5}
                style={{ filter: "drop-shadow(0 2px 4px rgba(15,23,42,0.35))" }}
            />
        </svg>
    );
};

export default DataCanvas;
