import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useT } from '../../i18n';
import PlotPanel, { Readout } from './PlotPanel';
import { AXIS_LABEL, EQUATION } from './chartStyles';

import type { PlotData, Step } from './types';

interface LogisticRegressionPlotProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const LogisticRegressionPlot: React.FC<LogisticRegressionPlotProps> = ({ data, currentStep }) => {
    const t = useT('gradient').plots.logistic2d;
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !currentStep) return;

        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(data.x ?? []) as [number, number])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-0.1, 1.1])
            .range([height, 0]);

        // Axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        // Data points
        g.selectAll("circle")
            .data((data.x ?? []).map((val, i) => ({ x: val, y: (data.y ?? [])[i] })))
            .enter()
            .append("circle")
            .attr("cx", d => x(d.x ?? 0))
            .attr("cy", d => y(d.y ?? 0))
            .attr("r", 4)
            .style("fill", d => d.y === 1 ? "var(--accent-indigo)" : "var(--accent-red)")
            .attr("opacity", 0.6);

        // Logistic curve (sigmoid)
        const xMin = d3.min(data.x ?? []) ?? 0;
        const xMax = d3.max(data.x ?? []) ?? 0;
        const stepSize = (xMax - xMin) / 100;

        const curvePoints = Array.from({ length: 101 }, (_, i) => xMin + i * stepSize);

        const lineData = curvePoints.map(val => {
            const z = val * (currentStep.w ?? 0) + (currentStep.b ?? 0);
            const zClipped = Math.max(-50, Math.min(50, z));
            const y_pred = 1 / (1 + Math.exp(-zClipped));
            return { x: val, y: y_pred };
        });

        const line = d3.line<{ x: number, y: number }>()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .style("stroke", "var(--accent-green)")
            .attr("stroke-width", 3)
            .attr("d", line);

        // Labels
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 35)
            .attr("text-anchor", "middle")
            .attr("class", AXIS_LABEL)
            .text(t.xLabel);

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .attr("class", AXIS_LABEL)
            .text(t.yLabel);

    }, [data, currentStep, t]);

    return (
        <PlotPanel
            title={t.title}
            footer={
                <>
                    <Readout label={t.iteration} value={currentStep?.iteration} />
                    <Readout label={t.logLoss} value={currentStep?.cost.toFixed(4)} tone="red" />
                    <code className={EQUATION}>
                        P(y=1|x) = σ({currentStep?.w.toFixed(2)}x {currentStep && currentStep.b >= 0 ? '+' : ''} {currentStep?.b.toFixed(2)})
                    </code>
                </>
            }
        >
            <svg ref={svgRef} viewBox="0 0 500 400"></svg>
        </PlotPanel>
    );
};

export default LogisticRegressionPlot;
