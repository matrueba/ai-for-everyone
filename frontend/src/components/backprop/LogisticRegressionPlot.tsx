import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import type { PlotData, Step } from './types';

interface LogisticRegressionPlotProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const LogisticRegressionPlot: React.FC<LogisticRegressionPlotProps> = ({ data, currentStep }) => {
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
            .attr("fill", d => d.y === 1 ? "#6366f1" : "#ef4444")
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
            .attr("stroke", "#10b981") // Green color for sigmoid
            .attr("stroke-width", 3)
            .attr("d", line);

        // Labels
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 35)
            .attr("text-anchor", "middle")
            .text("Feature (X)");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Probability (P(y=1))");

    }, [data, currentStep]);

    return (
        <div className="card-elevated p-3 flex flex-col h-full min-h-0">
            <h3 className="text-base font-bold mb-1 text-slate-800 shrink-0">Model Classification Border</h3>
            <div className="flex-1 min-h-0 w-full relative flex items-center justify-center">
                <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-full max-h-[100%]"></svg>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex justify-between shrink-0 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-bold">Iteration: <span className="font-mono text-indigo-600">{currentStep?.iteration}</span></span>
                <span className="font-bold">Log Loss: <span className="font-mono text-rose-500">{currentStep?.cost.toFixed(4)}</span></span>
            </div>
            <div className="mt-1 text-xs font-mono text-indigo-600 font-bold text-center bg-indigo-50 p-1.5 rounded-lg shrink-0">
                P(y=1|x) = σ({currentStep?.w.toFixed(2)}x {currentStep && currentStep.b >= 0 ? '+' : ''} {currentStep?.b.toFixed(2)})
            </div>
        </div>
    );
};

export default LogisticRegressionPlot;
