import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RegressionPlot = ({ data, currentStep }) => {
    const svgRef = useRef();

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
            .domain(d3.extent(data.x))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([d3.min(data.y) - 2, d3.max(data.y) + 2])
            .range([height, 0]);

        // Axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        // Data points
        g.selectAll("circle")
            .data(data.x.map((val, i) => ({ x: val, y: data.y[i] })))
            .enter()
            .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 4)
            .attr("fill", "#6366f1")
            .attr("opacity", 0.6);

        // Regression line
        const lineData = data.x.map((val, i) => ({ x: val, y: currentStep.predictions[i] }));
        const line = d3.line()
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
            .text("Feature (X)");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Target (y)");

    }, [data, currentStep]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Model Adjustment</h3>
            <svg ref={svgRef} width="500" height="400"></svg>
            <div className="mt-2 text-sm text-slate-500">
                Iteration: {currentStep?.iteration} | Cost: {currentStep?.cost.toFixed(4)}
            </div>
        </div>
    );
};

export default RegressionPlot;
