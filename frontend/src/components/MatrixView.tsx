import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface MatrixData {
  left_text: string[];
  queries: number[][][][]; // [layer][head][token][d_k]
  keys: number[][][][];    // [layer][head][token][d_k]
}

interface MatrixViewProps {
  data: MatrixData | null;
  layer: number;
  head: number;
}

/**
 * MatrixView — visualizes Query (Q), Key (K), and Q×K Matrix
 * for a given layer / head / selected token.
 */
const MatrixView: React.FC<MatrixViewProps> = ({ data, layer, head }) => {
  const qRef = useRef<HTMLDivElement>(null);
  const kRef = useRef<HTMLDivElement>(null);
  const qkRef = useRef<HTMLDivElement>(null);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [matrixTab, setMatrixTab] = useState<string>("vectors"); // "vectors" | "product"

  const tokens = data?.left_text || [];
  const queries = data?.queries?.[layer]?.[head]; // [nTokens][d_k]
  const keys = data?.keys?.[layer]?.[head];       // [nTokens][d_k]

  function computeQK(Q: number[][], K: number[][]) {
    const n = Q.length;
    const dk = Q[0]?.length || 1;
    const scale = Math.sqrt(dk);
    const result: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      const qi = Q[i];
      for (let j = 0; j < n; j++) {
        let dot = 0;
        const kj = K[j];
        if (qi && kj) {
          for (let d = 0; d < dk; d++) {
            dot += (qi[d] ?? 0) * (kj[d] ?? 0);
          }
        }
        row.push(dot / scale);
      }
      result.push(row);
    }
    return result;
  }

  // Compute Q×K^T product matrix: [nTokens x nTokens]
  const qkMatrix = queries && keys ? computeQK(queries, keys) : null;

  // ── Render Q matrix ──
  useEffect(() => {
    if (!queries || !qRef.current) return;
    renderVectorMatrix(qRef.current, queries, tokens, "Q", "#4f46e5");
  }, [queries, tokens]);

  // ── Render K matrix ──
  useEffect(() => {
    if (!keys || !kRef.current) return;
    renderVectorMatrix(kRef.current, keys, tokens, "K", "#0891b2");
  }, [keys, tokens]);

  // ── Render Q×K matrix ──
  useEffect(() => {
    if (!qkMatrix || !qkRef.current) return;
    renderProductMatrix(qkRef.current, qkMatrix, tokens, selectedToken);
  }, [qkMatrix, tokens, selectedToken]);

  function renderVectorMatrix(el: HTMLDivElement, vectors: number[][], labels: string[], title: string, accentColor: string) {
    el.innerHTML = "";
    if (!vectors || vectors.length === 0) return;

    const nTokens = vectors.length;
    const dK = vectors[0]?.length ?? 0;

    // For readability, cap displayed dimensions
    const maxDims = Math.min(dK, 64);
    const cellW = 6;
    const cellH = 22;
    const labelPad = 90;
    const titleH = 32;
    const width = maxDims * cellW + labelPad + 20;
    const height = nTokens * cellH + titleH + 10;

    const svg = d3.select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "'JetBrains Mono', monospace");

    // Title
    svg.append("text")
      .text(`${title} matrix`)
      .attr("x", labelPad + (maxDims * cellW) / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .attr("font-weight", 600)
      .attr("fill", accentColor);

    // Find global min/max for color scale
    const flat = vectors.flatMap(v => v.slice(0, maxDims));
    const ext = d3.extent(flat) as [number, number];
    const maxAbs = Math.max(Math.abs(ext[0]), Math.abs(ext[1])) || 1;

    // Diverging color scale
    const colorScale = d3.scaleDiverging<string>(d3.interpolateRdBu)
      .domain([-maxAbs, 0, maxAbs]);

    // Cells
    vectors.forEach((vec, i) => {
      vec.slice(0, maxDims).forEach((val, j) => {
        svg.append("rect")
          .attr("x", labelPad + j * cellW)
          .attr("y", titleH + i * cellH)
          .attr("width", cellW - 1)
          .attr("height", cellH - 2)
          .attr("rx", 1)
          .attr("fill", colorScale(val) as string)
          .style("opacity", 0.85);
      });
    });

    // Row labels
    labels.forEach((tok, i) => {
      svg.append("text")
        .text(tok)
        .attr("x", labelPad - 6)
        .attr("y", titleH + i * cellH + cellH / 2 + 1)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#334155")
        .attr("font-size", 11);
    });
  }

  function renderProductMatrix(el: HTMLDivElement, matrix: number[][], labels: string[], highlightRow: number | null) {
    el.innerHTML = "";
    if (!matrix || matrix.length === 0) return;

    const n = matrix.length;
    const cellSize = Math.min(32, Math.max(18, Math.floor(500 / n)));
    const labelPad = 90;
    const titleH = 32;
    const width = n * cellSize + labelPad + 30;
    const height = n * cellSize + labelPad + titleH + 10;

    const svg = d3.select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "'JetBrains Mono', monospace");

    // Title
    svg.append("text")
      .text("Q × Kᵀ / √d_k")
      .attr("x", labelPad + (n * cellSize) / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .attr("font-weight", 600)
      .attr("fill", "#7c3aed");

    const flat = matrix.flat();
    const ext = d3.extent(flat) as [number, number];
    const maxAbs = Math.max(Math.abs(ext[0]), Math.abs(ext[1])) || 1;
    const colorScale = d3.scaleDiverging<string>(d3.interpolatePuOr)
      .domain([-maxAbs, 0, maxAbs]);

    // Tooltip
    const tooltip = d3.select(el)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "1000")
      .style("background", "#ffffff")
      .style("border", "1px solid rgba(15,23,42,0.1)")
      .style("border-radius", "6px")
      .style("padding", "5px 9px")
      .style("font-size", "11px")
      .style("font-family", "'JetBrains Mono', monospace")
      .style("color", "#0f172a")
      .style("pointer-events", "none")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.08)")
      .style("opacity", 0);

    // Cells
    matrix.forEach((row, i) => {
      row.forEach((val, j) => {
        svg.append("rect")
          .attr("x", labelPad + j * cellSize)
          .attr("y", titleH + labelPad + i * cellSize)
          .attr("width", cellSize - 1)
          .attr("height", cellSize - 1)
          .attr("rx", 3)
          .attr("fill", colorScale(val) as string)
          .attr("stroke", highlightRow === i ? "#7c3aed" : "transparent")
          .attr("stroke-width", highlightRow === i ? 2 : 0)
          .style("cursor", "crosshair")
          .style("transition", "stroke 0.1s")
          .on("mouseenter", function (this: SVGRectElement, event: MouseEvent) {
            d3.select(this).attr("stroke", "#0f172a");
            tooltip
              .style("opacity", 1)
              .html(
                `<span style="color:#64748b">q</span><sub>${i}</sub> · <span style="color:#64748b">k</span><sub>${j}</sub> = <strong>${val.toFixed(3)}</strong>`
              )
              .style("left", event.offsetX + 14 + "px")
              .style("top", event.offsetY - 10 + "px");
          })
          .on("mousemove", function (event: MouseEvent) {
            tooltip
              .style("left", event.offsetX + 14 + "px")
              .style("top", event.offsetY - 10 + "px");
          })
          .on("mouseleave", function (this: SVGRectElement) {
            d3.select(this).attr("stroke", highlightRow === i ? "#7c3aed" : "transparent");
            tooltip.style("opacity", 0);
          })
          .on("click", () => {
            setSelectedToken(selectedToken === i ? null : i);
          });
      });
    });

    // Row labels (Q tokens)
    labels.forEach((tok, i) => {
      svg.append("text")
        .text(tok)
        .attr("x", labelPad - 6)
        .attr("y", titleH + labelPad + i * cellSize + cellSize / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", highlightRow === i ? "#7c3aed" : "#334155")
        .attr("font-size", 11)
        .attr("font-weight", highlightRow === i ? 600 : 400);
    });

    // Column labels (K tokens)
    labels.forEach((tok, j) => {
      svg.append("text")
        .text(tok)
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#334155")
        .attr("font-size", 11)
        .attr("transform", `translate(${labelPad + j * cellSize + cellSize / 2}, ${titleH + labelPad - 8}) rotate(-45)`);
    });
  }

  if (!queries && !keys) {
    return (
      <div className="text-center py-12 text-text-tertiary text-sm">
        No query/key data available for this layer and head.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex bg-surface-card border border-border-default rounded-md overflow-hidden mb-6">
        <button
          onClick={() => setMatrixTab("vectors")}
          className={`px-4 py-2 text-xs font-medium cursor-pointer transition-colors ${matrixTab === "vectors" ? "bg-accent-indigo/10 text-accent-indigo" : "text-text-secondary hover:text-text-primary"}`}
        >
          Q & K Vectors
        </button>
        <button
          onClick={() => setMatrixTab("product")}
          className={`px-4 py-2 text-xs font-medium cursor-pointer transition-colors border-l border-border-default ${matrixTab === "product" ? "bg-accent-indigo/10 text-accent-indigo" : "text-text-secondary hover:text-text-primary"}`}
        >
          Q × Kᵀ Matrix
        </button>
      </div>

      {matrixTab === "vectors" && (
        <div className="flex flex-wrap gap-8 justify-center animate-fade-in-up">
          <div className="overflow-x-auto">
            <div ref={qRef} />
          </div>
          <div className="overflow-x-auto">
            <div ref={kRef} />
          </div>
        </div>
      )}

      {matrixTab === "product" && qkMatrix && (
        <div className="flex flex-col items-center gap-4 animate-fade-in-up">
          <div className="overflow-x-auto flex justify-center">
            <div ref={qkRef} style={{ position: "relative" }} />
          </div>
          {selectedToken !== null && (
            <p className="text-center text-xs text-text-tertiary font-mono">
              Selected token: <span className="text-accent-indigo font-semibold">{tokens[selectedToken]}</span> (index {selectedToken}) — click another cell to change
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MatrixView;
