import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import type { SurfaceData, Step } from './types';

interface CostSurfaceProps {
    surface: SurfaceData | null;
    steps: Step[] | null;
    currentIteration: number;
}

const CostSurface: React.FC<CostSurfaceProps> = ({ surface, steps, currentIteration }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimension, setDimension] = useState<'1d' | '2d' | 'mse'>('2d');

    useEffect(() => {
        if (!steps || steps.length === 0) return;

        // If we don't have surface and we are in 1D or 2D mode, we can't render those specific plots
        // But we still want to render MSE if that's selected
        if (!surface && dimension !== 'mse') return;

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        if (dimension === '2d' && surface && surface.w && surface.b) {
            // --- 2D Visualization (Contour Plot) ---
            const x = d3.scaleLinear()
                .domain(d3.extent(surface.w) as [number, number])
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain(d3.extent(surface.b) as [number, number])
                .range([height, 0]);

            const n = surface.w.length;
            const m = surface.b.length;
            const values = new Array(n * m);
            for (let j = 0; j < m; ++j) {
                for (let i = 0; i < n; ++i) {
                    values[j * n + i] = surface.z[j]?.[i] ?? 0;
                }
            }

            const contours = d3.contours()
                .size([n, m])
                .thresholds(20)
                (values);

            const valuesExtent = d3.extent(values) as [number, number];
            const color = d3.scaleSequential(d3.interpolateYlGnBu)
                .domain([valuesExtent[1], valuesExtent[0]]); // reverse() as [number, number] alternative

            g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#fff")
                .attr("stroke-opacity", 0.5)
                .selectAll("path")
                .data(contours)
                .enter().append("path")
                .attr("fill", d => color(d.value))
                .attr("d", d3.geoPath(d3.geoIdentity().scale(width / n)) as any);

            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            g.append("g")
                .call(d3.axisLeft(y));

            const pathData = steps.slice(0, currentIteration + 1);
            const line = d3.line<Step>()
                .x(d => x(d.w))
                .y(d => y(d.b));

            g.append("path")
                .datum(pathData)
                .attr("fill", "none")
                .attr("stroke", "#ef4444")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "4,2")
                .attr("d", line);

            if (pathData.length > 0) {
                const current = pathData[pathData.length - 1];
                if (current) {
                    g.append("circle")
                        .attr("cx", x(current.w))
                        .attr("cy", y(current.b))
                        .attr("r", 6)
                        .attr("fill", "#ef4444")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 2);
                }
            }

            g.append("text")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("class", "text-xs font-bold text-slate-400")
                .text("Peso (w)");

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .attr("class", "text-xs font-bold text-slate-400")
                .text("Sesgo (b)");

        } else if (dimension === 'mse') {
            // --- MSE Visualization (Cost vs Iteration) ---
            const x = d3.scaleLinear()
                .domain([0, steps.length - 1])
                .range([0, width]);

            const yMax = d3.max(steps, d => d.cost) ?? 0;
            const y = d3.scaleLinear()
                .domain([0, yMax * 1.1])
                .range([height, 0]);

            // Grid lines
            g.append("g")
                .attr("class", "grid")
                .attr("stroke", "#f1f5f9")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));

            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(10));

            g.append("g")
                .call(d3.axisLeft(y));

            const pathData = steps.slice(0, currentIteration + 1);
            const line = d3.line<Step>()
                .x(d => x(d.iteration))
                .y(d => y(d.cost))
                .curve(d3.curveMonotoneX);

            // Full path in light gray
            g.append("path")
                .datum(steps)
                .attr("fill", "none")
                .attr("stroke", "#e2e8f0")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Current path in blue
            g.append("path")
                .datum(pathData)
                .attr("fill", "none")
                .attr("stroke", "#6366f1")
                .attr("stroke-width", 3)
                .attr("d", line);

            if (pathData.length > 0) {
                const current = pathData[pathData.length - 1];
                if (current) {
                    g.append("circle")
                        .attr("cx", x(current.iteration))
                        .attr("cy", y(current.cost))
                        .attr("r", 5)
                        .attr("fill", "#6366f1")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 2);

                    // Vertical indicator
                    g.append("line")
                        .attr("x1", x(current.iteration))
                        .attr("y1", 0)
                        .attr("x2", x(current.iteration))
                        .attr("y2", height)
                        .attr("stroke", "#6366f1")
                        .attr("stroke-width", 1)
                        .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.5);
                }
            }

            g.append("text")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("class", "text-xs font-bold text-slate-400")
                .text("Iteración");

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .attr("class", "text-xs font-bold text-slate-400")
                .text("Coste (MSE)");
        } else if (dimension === '1d' && surface && surface.w && surface.b) {
            // --- 1D Visualization (Cost vs W) ---
            const lastStep = steps[steps.length - 1];
            const finalB = lastStep?.b ?? 0;
            let bestBIndex = 0;
            let minDiff = Infinity;
            surface.b.forEach((bVal, i) => {
                if (Math.abs(bVal - finalB) < minDiff) {
                    minDiff = Math.abs(bVal - finalB);
                    bestBIndex = i;
                }
            });

            const zRow = surface.z[bestBIndex] || []; // Array of costs for each w

            const x = d3.scaleLinear()
                .domain(d3.extent(surface.w) as [number, number])
                .range([0, width]);

            const zMax = d3.max(zRow) ?? 0;
            const y = d3.scaleLinear()
                .domain([0, zMax * 1.1])
                .range([height, 0]);

            // Grid lines
            g.append("g")
                .attr("class", "grid")
                .attr("stroke", "#f1f5f9")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));

            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            g.append("g")
                .call(d3.axisLeft(y));

            const surfaceLine = d3.line<number>()
                .x((_, i) => x(surface.w![i] ?? 0))
                .y(d => y(d))
                .curve(d3.curveMonotoneX);

            // Full cost function curve
            g.append("path")
                .datum(zRow)
                .attr("fill", "none")
                .attr("stroke", "#94a3b8")
                .attr("stroke-width", 2)
                .attr("d", surfaceLine as any);

            const getCost1D = (wValue: number) => {
                let bestWIndex = 0;
                let minWDiff = Infinity;
                surface.w!.forEach((wVal, i) => {
                    if (Math.abs(wVal - wValue) < minWDiff) {
                        minWDiff = Math.abs(wVal - wValue);
                        bestWIndex = i;
                    }
                });
                return zRow[bestWIndex] ?? 0;
            };

            const wExtent = d3.extent(surface.w) as [number, number];
            const [minW, maxW] = wExtent;
            const pathData = steps.slice(0, currentIteration + 1).filter(d => d.w >= minW && d.w <= maxW);
            const stepsLine = d3.line<Step>()
                .x(d => x(d.w))
                .y(d => y(getCost1D(d.w)))
                .curve(d3.curveLinear);

            g.append("path")
                .datum(pathData)
                .attr("fill", "none")
                .attr("stroke", "#ef4444")
                .attr("stroke-width", 2)
                .attr("d", stepsLine as any);

            g.selectAll(".step-point")
                .data(pathData)
                .enter().append("circle")
                .attr("class", "step-point")
                .attr("cx", d => x(d.w))
                .attr("cy", d => y(getCost1D(d.w)))
                .attr("r", 4)
                .attr("fill", "#ef4444")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1);

            if (pathData.length > 0) {
                const current = pathData[pathData.length - 1];
                if (current) {
                    g.append("line")
                        .attr("x1", x(current.w))
                        .attr("y1", y(getCost1D(current.w)))
                        .attr("x2", x(current.w))
                        .attr("y2", height)
                        .attr("stroke", "#ef4444")
                        .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.6);
                }
            }

            g.append("text")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("class", "text-xs font-bold text-slate-400")
                .text("Peso (w)");

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .attr("class", "text-xs font-bold text-slate-400")
                .text("Coste J(w)");
        }

    }, [surface, steps, currentIteration, dimension]);

    return (
        <div className="card-elevated p-3 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-1 shrink-0">
                <div>
                    <h3 className="text-base font-bold text-slate-800">
                        {dimension === '2d' ? 'Reducción del Error (2D)' : dimension === '1d' ? 'Función de Coste (1D)' : 'Reducción del Error (MSE)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                        {dimension === '2d' ? 'Camino de optimización sobre w y b' : dimension === '1d' ? 'Minimización de pérdida sobre w' : 'Minimización de pérdida en el tiempo'}
                    </p>
                </div>

                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                    <button
                        onClick={() => setDimension('1d')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${dimension === '1d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        1D
                    </button>
                    <button
                        onClick={() => setDimension('2d')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${dimension === '2d' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        2D
                    </button>
                    <button
                        onClick={() => setDimension('mse')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${dimension === 'mse' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        MSE
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-xl p-2 min-h-0">
                <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-full max-w-[500px]"></svg>
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs font-medium text-slate-600 shrink-0">
                <div className={`w-2 h-2 rounded-full animate-pulse ${dimension === '2d' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                {dimension === '2d' ? 'Buscando el mínimo global...' : `Coste actual: ${steps && steps[currentIteration]?.cost.toFixed(4)}`}
            </div>
        </div>
    );
};

export default CostSurface;
