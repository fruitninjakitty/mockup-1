import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ModuleData {
  id: string;
  name: string;
  // Add more properties as needed, e.g., semantic_embedding: number[];
}

interface LearningMapVisualizationProps {
  data: ModuleData[];
}

export function LearningMapVisualization({ data }: LearningMapVisualizationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous elements
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(data as d3.SimulationNodeDatum[])
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const nodes = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 8)
      .attr("fill", "#69b3a2");

    const labels = svg.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .text(d => d.name)
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("dx", 10) // offset text from node
      .attr("dy", 3); // offset text from node

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    const drag = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    nodes.call(drag as any);

    simulation.on("tick", () => {
      nodes
        .attr("cx", d => (d as d3.SimulationNodeDatum).x!)
        .attr("cy", d => (d as d3.SimulationNodeDatum).y!);
      labels
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!);
    });

  }, [data]); // Redraw when data changes

  return (
    <svg ref={svgRef} className="w-full h-full"></svg>
  );
} 