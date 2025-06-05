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

    // Append a group for zoom and pan
    const g = svg.append("g");

    const simulation = d3.forceSimulation(data as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Define color scale for difficulty
    const difficultyColor = d3.scaleOrdinal()
      .domain(["easy", "medium", "hard"])
      .range(["#a5d6a7", "#ffcc80", "#ef9a9a"]); // Green, Orange, Red shades

    const linkElements = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const nodeElements = g.append("g")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 8)
      .attr("fill", d => d.available ? difficultyColor(d.difficulty) as string : "#cccccc") // Grey for unavailable
      .attr("stroke", d => d.available ? "#fff" : "#999")
      .attr("stroke-dasharray", d => d.available ? "0" : "2 2"); // Dashed stroke for unavailable

    const labelElements = g.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .text(d => d.name)
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("dx", 10) // offset text from node
      .attr("dy", 3);

    const lockIcons = g.append("g")
      .selectAll("text")
      .data(data.filter(d => !d.available))
      .join("text")
      .attr("font-family", "FontAwesome, sans-serif") // Requires FontAwesome to be available
      .attr("font-size", 12)
      .attr("fill", "#333333")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text('\u{1F512}'); // Unicode for lock icon

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
      lockIcons
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!); // Center the lock icon on the node
    });

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Add color legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 120}, 20)`); // Position at top-right

    legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .text("Difficulty");

    const legendItems = ["easy", "medium", "hard"];

    legendItems.forEach((difficulty, i) => {
      const item = legend.append("g")
        .attr("transform", `translate(0, ${20 + i * 20})`);

      item.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", difficultyColor(difficulty) as string);

      item.append("text")
        .attr("x", 20)
        .attr("y", 8)
        .attr("dy", "0.35em")
        .attr("font-size", 10)
        .text(difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
    });

    // Add legend for availability
    const availabilityLegend = svg.append("g")
      .attr("transform", `translate(${width - 120}, ${20 + legendItems.length * 20 + 30})`);

    availabilityLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .text("Availability");

    const availabilityItems = [
      { label: "Available", fill: "#a5d6a7", stroke: "#fff", dasharray: "0" },
      { label: "Unavailable", fill: "#cccccc", stroke: "#999", dasharray: "2 2" }
    ];

    availabilityItems.forEach((item, i) => {
      const availItem = availabilityLegend.append("g")
        .attr("transform", `translate(0, ${20 + i * 20})`);

      availItem.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", item.fill)
        .attr("stroke", item.stroke)
        .attr("stroke-dasharray", item.dasharray);

      availItem.append("text")
        .attr("x", 20)
        .attr("y", 8)
        .attr("dy", "0.35em")
        .attr("font-size", 10)
        .text(item.label);
    });

  }, [data, links]); // Redraw when data or links change

  return (
    <svg ref={svgRef} className="w-full h-full"></svg>
  );
} 