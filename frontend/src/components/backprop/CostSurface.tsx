import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useT } from '../../i18n';
import PlotPanel, { Readout } from './PlotPanel';
import Tabs from '../ui/Tabs';
import { AXIS_LABEL } from './chartStyles';

import type { SurfaceData, Step } from './types';

interface CostSurfaceProps {
    surface: SurfaceData | null;
    steps: Step[] | null;
    currentIteration: number;
}

const CostSurface: React.FC<CostSurfaceProps> = ({ surface, steps, currentIteration }) => {
    const t = useT('gradient').plots.cost;
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
                .style("stroke", "var(--surface-card)")
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
                .style("stroke", "var(--accent-red)")
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
                        .style("fill", "var(--accent-red)")
                        .style("stroke", "var(--surface-card)")
                        .attr("stroke-width", 2);
                }
            }

            g.append("text")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("class", AXIS_LABEL)
                .text(t.axisWeight);

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .attr("class", AXIS_LABEL)
                .text(t.axisBias);

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
                .style("color", "var(--border-default)")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""))
                .call(grid => grid.select(".domain").remove());

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
                .style("stroke", "var(--border-strong)")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Current path in blue
            g.append("path")
                .datum(pathData)
                .attr("fill", "none")
                .style("stroke", "var(--accent-indigo)")
                .attr("stroke-width", 3)
                .attr("d", line);

            if (pathData.length > 0) {
                const current = pathData[pathData.length - 1];
                if (current) {
                    g.append("circle")
                        .attr("cx", x(current.iteration))
                        .attr("cy", y(current.cost))
                        .attr("r", 5)
                        .style("fill", "var(--accent-indigo)")
                        .style("stroke", "var(--surface-card)")
                        .attr("stroke-width", 2);

                    // Vertical indicator
                    g.append("line")
                        .attr("x1", x(current.iteration))
                        .attr("y1", 0)
                        .attr("x2", x(current.iteration))
                        .attr("y2", height)
                        .style("stroke", "var(--accent-indigo)")
                        .attr("stroke-width", 1)
                        .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.5);
                }
            }

            g.append("text")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("class", AXIS_LABEL)
                .text(t.axisIteration);

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .attr("class", AXIS_LABEL)
                .text(t.axisCostMse);
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
                .style("color", "var(--border-default)")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""))
                .call(grid => grid.select(".domain").remove());

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
                .style("stroke", "var(--text-muted)")
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
                .style("stroke", "var(--accent-red)")
                .attr("stroke-width", 2)
                .attr("d", stepsLine as any);

            g.selectAll(".step-point")
                .data(pathData)
                .enter().append("circle")
                .attr("class", "step-point")
                .attr("cx", d => x(d.w))
                .attr("cy", d => y(getCost1D(d.w)))
                .attr("r", 4)
                .style("fill", "var(--accent-red)")
                .style("stroke", "var(--surface-card)")
                .attr("stroke-width", 1);

            if (pathData.length > 0) {
                const current = pathData[pathData.length - 1];
                if (current) {
                    g.append("line")
                        .attr("x1", x(current.w))
                        .attr("y1", y(getCost1D(current.w)))
                        .attr("x2", x(current.w))
                        .attr("y2", height)
                        .style("stroke", "var(--accent-red)")
                        .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.6);
                }
            }

            g.append("text")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("class", AXIS_LABEL)
                .text(t.axisWeight);

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("x", -height / 2)
                .attr("text-anchor", "middle")
                .attr("class", AXIS_LABEL)
                .text(t.axisCostJ);
        }

    }, [surface, steps, currentIteration, dimension, t]);

    return (
        <PlotPanel
            title={t.titles[dimension]}
            subtitle={t.subtitles[dimension]}
            actions={
                <Tabs
                    label={t.titles[dimension]}
                    size="sm"
                    value={dimension}
                    onChange={setDimension}
                    items={[
                        { id: '1d', label: '1D' },
                        { id: '2d', label: '2D' },
                        { id: 'mse', label: 'MSE' },
                    ]}
                />
            }
            footer={
                dimension === '2d'
                    ? <span>{t.searching}</span>
                    : <Readout label={t.currentCost} value={steps?.[currentIteration]?.cost.toFixed(4)} tone="red" />
            }
        >
            <svg ref={svgRef} viewBox="0 0 500 400"></svg>
        </PlotPanel>
    );
};

export default CostSurface;
