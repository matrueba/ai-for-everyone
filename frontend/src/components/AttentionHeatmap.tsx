import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface AttentionData {
  left_text: string[];
  right_text: string[];
  attn: number[][][][];
}

interface AttentionHeatmapProps {
  data: AttentionData | null;
  layer: number;
  head: number;
}

/**
 * AttentionHeatmap — renders the attention matrix as an interactive heatmap.
 */
const AttentionHeatmap: React.FC<AttentionHeatmapProps> = ({ data, layer, head }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = "";

    const leftText = data.left_text;
    const rightText = data.right_text;
    const attn = data.attn[layer]?.[head];
    if (!attn) return;

    const cellSize = 32;
    const labelPad = 90;
    const width = rightText.length * cellSize + labelPad + 20;
    const height = leftText.length * cellSize + labelPad + 20;

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "'JetBrains Mono', monospace");

    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(attn.flat()) as number]);

    // Tooltip
    const tooltip = d3
      .select(el)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "1000")
      .style("background", "#ffffff")
      .style("border", "1px solid rgba(15,23,42,0.1)")
      .style("border-radius", "6px")
      .style("padding", "4px 8px")
      .style("font-size", "11px")
      .style("font-family", "'JetBrains Mono', monospace")
      .style("color", "#0f172a")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Cells
    attn.forEach((row, i) => {
      row.forEach((w, j) => {
        svg
          .append("rect")
          .attr("x", labelPad + j * cellSize)
          .attr("y", labelPad + i * cellSize)
          .attr("width", cellSize - 2)
          .attr("height", cellSize - 2)
          .attr("rx", 4)
          .attr("fill", colorScale(w))
          .attr("stroke", "transparent")
          .attr("stroke-width", 2)
          .style("cursor", "crosshair")
          .style("transition", "stroke 0.15s")
          .on("mouseenter", function (this: SVGRectElement, event: MouseEvent) {
            d3.select(this).attr("stroke", "#0f172a");
            tooltip
              .style("opacity", 1)
              .html(
                `<span style="color:#64748b">${leftText[i]}</span> → <span style="color:#0891b2">${rightText[j]}</span><br/><strong>${w.toFixed(4)}</strong>`
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
            d3.select(this).attr("stroke", "transparent");
            tooltip.style("opacity", 0);
          });
      });
    });

    // Row labels (left = source tokens)
    leftText.forEach((tok, i) => {
      svg
        .append("text")
        .text(tok)
        .attr("x", labelPad - 6)
        .attr("y", labelPad + i * cellSize + cellSize / 2 + 1)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#334155")
        .attr("font-size", 11);
    });

    // Column labels (top = target tokens)
    rightText.forEach((tok, j) => {
      svg
        .append("text")
        .text(tok)
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#334155")
        .attr("font-size", 11)
        .attr(
          "transform",
          `translate(${labelPad + j * cellSize + cellSize / 2}, ${labelPad - 8}) rotate(-45)`
        );
    });
  }, [data, layer, head]);

  return (
    <div ref={containerRef} style={{ position: "relative" }} />
  );
}

export default AttentionHeatmap;
