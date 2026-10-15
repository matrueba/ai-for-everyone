import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface AttentionData {
  left_text: string[];
  right_text: string[];
  attn: number[][][][];
}

interface AttentionLinesProps {
  data: AttentionData | null;
  layer: number;
  head: number;
}

/**
 * AttentionLines — SVG-based attention flow visualization.
 * Renders left/right token columns with connecting lines whose
 * opacity reflects attention weight. On hover, a single source
 * token is highlighted.
 */
const AttentionLines: React.FC<AttentionLinesProps> = ({ data, layer, head }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = "";

    const leftText = data.left_text;
    const rightText = data.right_text;
    const attn = data.attn[layer]?.[head];
    if (!attn) return;

    const BOX_H = 28;
    const BOX_W = 150;
    const GAP = 400;
    const PAD_TOP = 16;
    const width = BOX_W * 2 + GAP;
    const height = Math.max(leftText.length, rightText.length) * BOX_H + PAD_TOP + 20;

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "'JetBrains Mono', monospace");

    const leftX = BOX_W;
    const rightX = BOX_W + GAP;

    // Attention lines
    const linesG = svg.append("g");
    attn.forEach((row, srcIdx) => {
      row.forEach((w, tgtIdx) => {
        linesG
          .append("line")
          .attr("x1", leftX)
          .attr("y1", srcIdx * BOX_H + PAD_TOP + BOX_H / 2)
          .attr("x2", rightX)
          .attr("y2", tgtIdx * BOX_H + PAD_TOP + BOX_H / 2)
          .style("stroke", "var(--accent-indigo)")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", w)
          .attr("class", `line-src-${srcIdx}`);
      });
    });

    // Left tokens
    leftText.forEach((tok, i) => {
      const g = svg.append("g").attr("class", "left-tok").style("cursor", "default");
      g.append("rect")
        .attr("x", 0)
        .attr("y", i * BOX_H + PAD_TOP)
        .attr("width", BOX_W)
        .attr("height", BOX_H - 4)
        .attr("rx", 6)
        .attr("fill", "transparent")
        .attr("class", `highlight-left-${i}`);

      g.append("text")
        .text(tok)
        .attr("x", BOX_W - 6)
        .attr("y", i * BOX_H + PAD_TOP + BOX_H / 2 + 1)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .style("fill", "var(--text-secondary)")
        .attr("font-size", 13)
        .attr("class", `text-left-${i}`);

      g.on("mouseenter", () => {
        // Dim all lines
        linesG.selectAll("line").attr("stroke-opacity", 0.02);
        
        // Highlight this source's lines
        linesG.selectAll<SVGLineElement, unknown>(`.line-src-${i}`).each(function (_, j) {
          d3.select(this).attr("stroke-opacity", attn[i]?.[j] ?? 0);
        });

        // Highlight left token
        svg.select(`.highlight-left-${i}`).style("fill", "color-mix(in srgb, var(--accent-indigo) 12%, transparent)");
        svg.select(`.text-left-${i}`).style("fill", "var(--text-primary)");

        // Highlight right tokens proportionally
        rightText.forEach((_, j) => {
          svg
            .select(`.highlight-right-${j}`)
            .style("fill", "var(--accent-cyan)")
            .style("fill-opacity", Math.min(1, (attn[i]?.[j] ?? 0) * 1.2));
        });
      });
      
      g.on("mouseleave", () => {
        // Restore all lines
        attn.forEach((row, si) => {
          row.forEach((w, ti) => {
            linesG
              .selectAll<SVGLineElement, unknown>(`.line-src-${si}`)
              .filter((_, idx) => idx === ti)
              .attr("stroke-opacity", w);
          });
        });
        svg.selectAll("[class^='highlight-left']").style("fill", "transparent");
        svg.selectAll("[class^='text-left']").style("fill", "var(--text-secondary)");
        svg.selectAll("[class^='highlight-right']").style("fill", "transparent");
      });
    });

    // Right tokens
    rightText.forEach((tok, i) => {
      svg
        .append("rect")
        .attr("x", rightX)
        .attr("y", i * BOX_H + PAD_TOP)
        .attr("width", BOX_W)
        .attr("height", BOX_H - 4)
        .attr("rx", 6)
        .attr("fill", "transparent")
        .attr("class", `highlight-right-${i}`);

      svg
        .append("text")
        .text(tok)
        .attr("x", rightX + 6)
        .attr("y", i * BOX_H + PAD_TOP + BOX_H / 2 + 1)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .style("fill", "var(--text-secondary)")
        .attr("font-size", 13)
        .style("font-family", "'JetBrains Mono', monospace");
    });
  }, [data, layer, head]);

  return <div ref={containerRef} />;
}

export default AttentionLines;
