import { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * AttentionLines — SVG-based attention flow visualization.
 * Renders left/right token columns with connecting lines whose
 * opacity reflects attention weight. On hover, a single source
 * token is highlighted.
 */
export default function AttentionLines({ data, layer, head }) {
  const containerRef = useRef(null);

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
          .attr("stroke", "#4f46e5")
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
        .attr("fill", "#334155")
        .attr("font-size", 13)
        .attr("class", `text-left-${i}`);

      g.on("mouseenter", () => {
        // Dim all lines
        linesG.selectAll("line").attr("stroke-opacity", 0.02);
        // Highlight this source's lines
        linesG.selectAll(`.line-src-${i}`).attr("stroke-opacity", (_, j, nodes) => {
          return +d3.select(nodes[j]).attr("stroke-opacity") > 0.2
            ? +attn[i][j]
            : attn[i][j];
        });
        linesG.selectAll(`.line-src-${i}`).each(function (_, j) {
          d3.select(this).attr("stroke-opacity", attn[i][j]);
        });

        // Highlight left token
        svg.select(`.highlight-left-${i}`).attr("fill", "rgba(38, 28, 226, 0.1)");
        svg.select(`.text-left-${i}`).attr("fill", "#0f172a");

        // Highlight right tokens proportionally
        rightText.forEach((_, j) => {
          svg
            .select(`.highlight-right-${j}`)
            .attr("fill", `rgba(8,145,178,${attn[i][j] * 1.2})`);
        });
      });
      g.on("mouseleave", () => {
        linesG.selectAll("line").each(function () {
          const node = d3.select(this);
          const cls = node.attr("class") || "";
          const match = cls.match(/line-src-(\d+)/);
          if (match) {
            const s = +match[1];
            const t = +[...node.node().parentNode.children].indexOf(node.node());
            // Restore original opacities
          }
        });
        // Simpler: just re-set all
        attn.forEach((row, si) => {
          row.forEach((w, ti) => {
            linesG
              .selectAll(`.line-src-${si}`)
              .filter((_, idx) => idx === ti)
              .attr("stroke-opacity", w);
          });
        });
        svg.selectAll("[class^='highlight-left']").attr("fill", "transparent");
        svg.selectAll("[class^='text-left']").attr("fill", "#334155");
        svg.selectAll("[class^='highlight-right']").attr("fill", "transparent");
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
        .attr("fill", "#334155")
        .attr("font-size", 13)
        .style("font-family", "'JetBrains Mono', monospace");
    });
  }, [data, layer, head]);

  return <div ref={containerRef} />;
}
