import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CostSurface = ({ surface, steps, currentIteration }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!surface || !steps) return;

        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(surface.w))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain(d3.extent(surface.b))
            .range([height, 0]);

        // Create contours
        const n = surface.w.length;
        const m = surface.b.length;
        const values = new Array(n * m);
        for (let j = 0; j < m; ++j) {
            for (let i = 0; i < n; ++i) {
                values[j * n + i] = surface.z[j][i];
            }
        }

        const contours = d3.contours()
            .size([n, m])
            .thresholds(20)
            (values);

        const color = d3.scaleSequential(d3.interpolateYlGnBu)
            .domain(d3.extent(values).reverse());

        // Draw contours
        g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.5)
            .selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("fill", d => color(d.value))
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / n)));

        // Axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        // Optimization path
        const pathData = steps.slice(0, currentIteration + 1);
        const line = d3.line()
            .x(d => x(d.w))
            .y(d => y(d.b));

        g.append("path")
            .datum(pathData)
            .attr("fill", "none")
            .attr("stroke", "#ef4444")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4,2")
            .attr("d", line);

        // Current point
        if (pathData.length > 0) {
            const current = pathData[pathData.length - 1];
            g.append("circle")
                .attr("cx", x(current.w))
                .attr("cy", y(current.b))
                .attr("r", 6)
                .attr("fill", "#ef4444")
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);
        }

        // Labels
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 35)
            .attr("text-anchor", "middle")
            .text("Weight (w)");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Bias (b)");

    }, [surface, steps, currentIteration]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Cost Landscape (w vs b)</h3>
            <svg ref={svgRef} width="500" height="400"></svg>
            <div className="mt-2 text-sm text-slate-500">
                Searching for minimum error...
            </div>
        </div>
    );
};

export default CostSurface;
