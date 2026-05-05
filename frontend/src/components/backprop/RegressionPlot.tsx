import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import type { PlotData, Step } from './types';

interface RegressionPlotProps {
    data: PlotData | null | undefined;
    currentStep: Step | null | undefined;
}

const RegressionPlot: React.FC<RegressionPlotProps> = ({ data, currentStep }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !currentStep || !currentStep.predictions || !data.x || !data.y) return;

        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xExtent = d3.extent(data.x) as [number, number];
        const x = d3.scaleLinear()
            .domain(xExtent)
            .range([0, width]);

        const yMin = d3.min(data.y) ?? 0;
        const yMax = d3.max(data.y) ?? 0;
        const y = d3.scaleLinear()
            .domain([yMin - 2, yMax + 2])
            .range([height, 0]);

        // Axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        // Data points
        g.selectAll("circle")
            .data(data.x.map((val, i) => ({ x: val, y: data.y ? (data.y[i] ?? 0) : 0 })))
            .enter()
            .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 4)
            .attr("fill", "#6366f1")
            .attr("opacity", 0.6);

        // Regression line
        const lineData = data.x.map((val, i) => ({ x: val, y: currentStep.predictions ? (currentStep.predictions[i] ?? 0) : 0 }));
        const line = d3.line<{ x: number, y: number }>()
            .x(d => x(d.x))
            .y(d => y(d.y));

        g.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", "#ef4444")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Labels
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 35)
            .attr("text-anchor", "middle")
            .text("Característica (X)");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Objetivo (y)");

    }, [data, currentStep]);

    return (
        <div className="bg-white p-4 rounded-2xl  border border-slate-100 flex flex-col h-full min-h-0">
            <h3 className="text-lg font-bold text-slate-800 mb-3 shrink-0">Ajuste del Modelo</h3>
            <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-xl p-4 min-h-0">
                <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-full max-h-[500px]"></svg>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm font-medium text-slate-600 shrink-0">
                <div className="w-2 h-2 rounded-full animate-pulse bg-indigo-500"></div>
                Iteración: {currentStep?.iteration} | Coste: {currentStep?.cost.toFixed(4)}
            </div>
        </div>
    );
};

export default RegressionPlot;
