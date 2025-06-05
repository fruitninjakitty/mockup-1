import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export interface ModuleData {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  available: boolean;
}

export interface LinkData {
  source: string;
  target: string;
}

interface LearningMapVisualizationProps {
  data: ModuleData[];
  links: LinkData[];
}

export function LearningMapVisualization({ data, links }: LearningMapVisualizationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous elements
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(data as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Define color scale for difficulty
    const difficultyColor = d3.scaleOrdinal()
      .domain(["easy", "medium", "hard"])
      .range(["#a5d6a7", "#ffcc80", "#ef9a9a"]); // Green, Orange, Red shades

    const linkElements = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const nodeElements = svg.append("g")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 8)
      .attr("fill", d => d.available ? difficultyColor(d.difficulty) as string : "#cccccc") // Grey for unavailable
      .attr("stroke", d => d.available ? "#fff" : "#999")
      .attr("stroke-dasharray", d => d.available ? "0" : "2 2"); // Dashed stroke for unavailable

    const labelElements = svg.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .text(d => d.name)
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("dx", 10) // offset text from node
      .attr("dy", 3);

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

    nodeElements.call(drag as any);

    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("cx", d => (d as d3.SimulationNodeDatum).x!)
        .attr("cy", d => (d as d3.SimulationNodeDatum).y!);
      labelElements
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!);
    });

  }, [data, links]); // Redraw when data or links change

  return (
    <svg ref={svgRef} className="w-full h-full"></svg>
  );
} 