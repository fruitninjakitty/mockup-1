import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ModuleDetailsOverlay } from './ModuleDetailsOverlay';

export interface ModuleData {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  available: boolean;
  completed: boolean;
  content?: { type: 'text' | 'image' | 'audio'; value: string; }; // Added for multi-modal support
}

export interface LinkData {
  source: string;
  target: string;
}

interface LearningPath {
  id: string;
  name: string;
  modules: string[]; // Ordered array of module IDs in the path
}

interface LearningMapVisualizationProps {
  data: ModuleData[];
  links: LinkData[];
  theme: 'light' | 'dark' | 'contrast';
  selectedPath: LearningPath | null;
  currentModuleInPath: ModuleData | null;
}

export function LearningMapVisualization({ data, links, theme, selectedPath, currentModuleInPath }: LearningMapVisualizationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the parent container
  const [currentTransform, setCurrentTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity); // State for zoom transform
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null); // State for selected module
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Define theme colors
  const themeColors = {
    light: {
      background: '#f8f9fa',
      nodeFillAvailable: (difficulty: 'easy' | 'medium' | 'hard') => {
        const colorScale = d3.scaleOrdinal<string, string>()
          .domain(["easy", "medium", "hard"])
          .range(["#a5d6a7", "#ffcc80", "#ef9a9a"]); // Green, Orange, Red shades
        return colorScale(difficulty);
      },
      nodeFillCompleted: '#4CAF50',
      nodeFillUnavailable: '#cccccc',
      nodeStroke: '#e0e0e0',
      nodeStrokeUnavailable: '#c0c0c0',
      linkStroke: '#b0b0b0',
      labelFill: 'black',
      lockIconFill: '#333333',
      checkmarkFill: 'white',
      minimapBackground: 'rgba(255,255,255,0.8)',
      minimapStroke: '#c0c0c0',
      minimapViewboxStroke: '#6a6a6a',
      legendText: 'black',
    },
    dark: {
      background: '#343a40',
      nodeFillAvailable: (difficulty: 'easy' | 'medium' | 'hard') => {
        const colorScale = d3.scaleOrdinal<string, string>()
          .domain(["easy", "medium", "hard"])
          .range(["#66bb6a", "#ffa726", "#ef5350"]); // Darker shades for contrast
        return colorScale(difficulty);
      },
      nodeFillCompleted: '#66bb6a',
      nodeFillUnavailable: '#6c757d',
      nodeStroke: '#495057',
      nodeStrokeUnavailable: '#9a9fa6',
      linkStroke: '#868e96',
      labelFill: 'white',
      lockIconFill: '#e9ecef',
      checkmarkFill: 'black',
      minimapBackground: 'rgba(0,0,0,0.6)',
      minimapStroke: '#7a7a7a',
      minimapViewboxStroke: '#bbbbbb',
      legendText: 'white',
    },
    contrast: {
      background: '#000000',
      nodeFillAvailable: (difficulty: 'easy' | 'medium' | 'hard') => {
        const colorScale = d3.scaleOrdinal<string, string>()
          .domain(["easy", "medium", "hard"])
          .range(["#4CAF50", "#FFC107", "#F44336"]); // More balanced, still high contrast
        return colorScale(difficulty);
      },
      nodeFillCompleted: '#4CAF50',
      nodeFillUnavailable: '#606060',
      nodeStroke: '#e0e0e0',
      nodeStrokeUnavailable: '#a0a0a0',
      linkStroke: '#b0b0b0',
      labelFill: '#ffffff',
      lockIconFill: '#ffffff',
      checkmarkFill: '#000000',
      minimapBackground: 'rgba(0,0,0,0.9)',
      minimapStroke: '#a0a0a0',
      minimapViewboxStroke: '#FFD700',
      legendText: '#ffffff',
    },
  };

  const currentThemeColors = themeColors[theme];

  // Effect to get initial dimensions and handle resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial dimensions
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous elements
    svg.selectAll('*').remove();

    // Set SVG background color based on theme
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", currentThemeColors.background);

    // Append a group for zoom and pan
    const g = svg.append("g");

    const simulation = d3.forceSimulation(data as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(30))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Define color scale for difficulty (now using theme-dependent function)
    const difficultyColor = currentThemeColors.nodeFillAvailable;

    const linkElements = g.append("g")
      .attr("stroke-opacity", 0.8)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("stroke", d => {
        const isPathLink = selectedPath && 
                           selectedPath.modules.includes((d.source as any).id) && 
                           selectedPath.modules.includes((d.target as any).id) &&
                           selectedPath.modules.indexOf((d.source as any).id) < selectedPath.modules.indexOf((d.target as any).id);
        return isPathLink ? "#1E90FF" : currentThemeColors.linkStroke;
      })
      .attr("stroke-width", d => {
        const isPathLink = selectedPath && 
                           selectedPath.modules.includes((d.source as any).id) && 
                           selectedPath.modules.includes((d.target as any).id) &&
                           selectedPath.modules.indexOf((d.source as any).id) < selectedPath.modules.indexOf((d.target as any).id);
        return isPathLink ? 4 : 1.5;
      });

    const nodeElements = g.append("g")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 12)
      .attr("fill", d => {
        if (d.completed) return currentThemeColors.nodeFillCompleted;
        if (!d.available) return currentThemeColors.nodeFillUnavailable;
        return difficultyColor(d.difficulty);
      })
      .attr("stroke", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return "#FFD700";
        if (selectedPath && selectedPath.modules.includes(d.id)) return "#1E90FF";
        return d.available ? currentThemeColors.nodeStroke : currentThemeColors.nodeStrokeUnavailable;
      })
      .attr("stroke-width", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return 4;
        if (selectedPath && selectedPath.modules.includes(d.id)) return 3.5;
        return 2;
      })
      .attr("stroke-dasharray", d => d.available ? "0" : "2 2")
      .on("mouseover", function(event, d) {
        if (!(currentModuleInPath && d.id === currentModuleInPath.id)) {
          d3.select(this).attr("stroke", "#FFD700").attr("stroke-width", 5);
          labelElements.filter(p => p.id === d.id).attr("font-weight", "bold");
        }
      })
      .on("mouseout", function(event, d) {
        if (!(currentModuleInPath && d.id === currentModuleInPath.id)) {
          d3.select(this).attr("stroke", d.available ? currentThemeColors.nodeStroke : currentThemeColors.nodeStrokeUnavailable).attr("stroke-width", d => {
            if (selectedPath && selectedPath.modules.includes(d.id)) return 3.5;
            return 2;
          });
          labelElements.filter(p => p.id === d.id).attr("font-weight", "normal");
        }
      })
      .on("click", function(event, d) {
        const currentZoomTransform = d3.zoomTransform(svg.node() as SVGSVGElement);
        const newX = -((d as d3.SimulationNodeDatum).x! * currentZoomTransform.k) + width / 2;
        const newY = -((d as d3.SimulationNodeDatum).y! * currentZoomTransform.k) + height / 2;
        svg.transition().duration(750).ease(d3.easeCubicInOut).call(zoom.transform as any, d3.zoomIdentity.translate(newX, newY).scale(currentZoomTransform.k));

        setSelectedModule(d as ModuleData);
      });

    const labelElements = g.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .text(d => d.name)
      .attr("font-size", (d) => currentTransform.k > 0.6 ? 14 : 0)
      .attr("fill", currentThemeColors.labelFill)
      .attr("dx", 10)
      .attr("dy", 3)
      .style("display", (d) => currentTransform.k > 0.6 ? "block" : "none");

    const lockIcons = g.append("g")
      .selectAll("text")
      .data(data.filter(d => !d.available))
      .join("text")
      .attr("font-family", "FontAwesome, sans-serif")
      .attr("font-size", 14)
      .attr("fill", currentThemeColors.lockIconFill)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text('\u{1F512}')
      .style("display", (d) => currentTransform.k > 0.9 ? "block" : "none");

    const checkmarks = g.append("g")
      .selectAll("text")
      .data(data.filter(d => d.completed))
      .join("text")
      .attr("font-family", "FontAwesome, sans-serif")
      .attr("font-size", 14)
      .attr("fill", currentThemeColors.checkmarkFill)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text('\u{2713}');

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
        .attr("cy", d => (d as d3.SimulationNodeDatum).y!)
        .attr("r", (d) => currentTransform.k * 15 > 8 ? 15 : (currentTransform.k * 15 < 5 ? 5 : currentTransform.k * 15));
      labelElements
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!);
      lockIcons
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!);
      checkmarks
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setCurrentTransform(event.transform);
        updateMinimapViewbox(event.transform);
      });
    svg.call(zoom);

    if (currentModuleInPath) {
      const currentModuleDatum = currentModuleInPath as d3.SimulationNodeDatum;
      const initialX = -(currentModuleDatum.x! * currentTransform.k) + width / 2;
      const initialY = -(currentModuleDatum.y! * currentTransform.k) + height / 2;
      svg.transition().duration(750).ease(d3.easeCubicInOut).call(zoom.transform as any, d3.zoomIdentity.translate(initialX, initialY).scale(currentTransform.k));
    }

    const minimapWidth = 200;
    const minimapHeight = 200;
    const allNodes = data as d3.SimulationNodeDatum[];
    const xMin = d3.min(allNodes, d => d.x || 0) || 0;
    const xMax = d3.max(allNodes, d => d.x || 0) || 0;
    const yMin = d3.min(allNodes, d => d.y || 0) || 0;
    const yMax = d3.max(allNodes, d => d.y || 0) || 0;

    const graphWidth = xMax - xMin;
    const graphHeight = yMax - yMin;

    const minimapScale = Math.min(minimapWidth / (graphWidth + 20), minimapHeight / (graphHeight + 20));

    const minimap = svg.append("g")
      .attr("transform", `translate(${width - minimapWidth - 10}, ${height - minimapHeight - 10})`);

    minimap.append("rect")
      .attr("width", minimapWidth)
      .attr("height", minimapHeight)
      .attr("fill", currentThemeColors.minimapBackground)
      .attr("stroke", currentThemeColors.minimapStroke)
      .attr("stroke-width", 1)
      .on("click", function(event) {
        const [minimapX, minimapY] = d3.pointer(event, this);

        const targetX = (minimapX / minimapScale) + xMin;
        const targetY = (minimapY / minimapScale) + yMin;

        const currentZoomTransform = d3.zoomTransform(svg.node() as SVGSVGElement);
        const newX = -targetX * currentZoomTransform.k + width / 2;
        const newY = -targetY * currentZoomTransform.k + height / 2;
        svg.transition().duration(500).call(zoom.transform as any, d3.zoomIdentity.translate(newX, newY).scale(currentZoomTransform.k));
        setSelectedModule(null);
      });

    minimap.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 0.5)
      .attr("stroke", d => {
        const isPathLink = selectedPath && 
                           selectedPath.modules.includes((d.source as any).id) && 
                           selectedPath.modules.includes((d.target as any).id) &&
                           selectedPath.modules.indexOf((d.source as any).id) < selectedPath.modules.indexOf((d.target as any).id);
        return isPathLink ? "#1E90FF" : currentThemeColors.linkStroke;
      })
      .attr("x1", (d: any) => (d.source.x - xMin) * minimapScale)
      .attr("y1", (d: any) => (d.source.y - yMin) * minimapScale)
      .attr("x2", (d: any) => (d.target.x - xMin) * minimapScale)
      .attr("y2", (d: any) => (d.target.y - yMin) * minimapScale);

    minimap.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 3)
      .attr("fill", d => d.available ? currentThemeColors.nodeFillAvailable(d.difficulty) : currentThemeColors.nodeFillUnavailable)
      .attr("cx", d => (d.x! - xMin) * minimapScale)
      .attr("cy", d => (d.y! - yMin) * minimapScale)
      .attr("stroke", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return "#FFD700";
        if (selectedPath && selectedPath.modules.includes(d.id)) return "#1E90FF";
        return "none";
      })
      .attr("stroke-width", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return 1;
        if (selectedPath && selectedPath.modules.includes(d.id)) return 0.5;
        return 0;
      });

    const minimapViewbox = minimap.append("rect")
      .attr("stroke", currentThemeColors.minimapViewboxStroke)
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("pointer-events", "none");

    function updateMinimapViewbox(transform: d3.ZoomTransform) {
      minimapViewbox
        .attr("x", -transform.x * minimapScale / transform.k)
        .attr("y", -transform.y * minimapScale / transform.k)
        .attr("width", width * minimapScale / transform.k)
        .attr("height", height * minimapScale / transform.k);
    }

    simulation.on("end", () => {
      updateMinimapViewbox(d3.zoomTransform(svg.node() as SVGSVGElement));
    });

    const legend = svg.append("g")
      .attr("transform", `translate(${width - 130}, 20)`);

    legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", 13)
      .attr("font-weight", "bold")
      .attr("fill", currentThemeColors.legendText)
      .text("Difficulty");

    const legendItems = ["easy", "medium", "hard"];

    legendItems.forEach((difficulty, i) => {
      const item = legend.append("g")
        .attr("transform", `translate(0, ${22 + i * 22})`);

      item.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", currentThemeColors.nodeFillAvailable(difficulty as 'easy' | 'medium' | 'hard') as string);

      item.append("text")
        .attr("x", 20)
        .attr("y", 8)
        .attr("dy", "0.35em")
        .attr("font-size", 11)
        .attr("fill", currentThemeColors.legendText)
        .text(difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
    });

    const availabilityLegend = svg.append("g")
      .attr("transform", `translate(${width - 130}, ${20 + legendItems.length * 22 + 35})`);

    availabilityLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("font-size", 13)
      .attr("font-weight", "bold")
      .attr("fill", currentThemeColors.legendText)
      .text("Availability");

    const availabilityItems = [
      { label: "Available (Not Started)", fill: currentThemeColors.nodeFillAvailable('easy'), stroke: currentThemeColors.nodeStroke, dasharray: "0" },
      { label: "Completed", fill: currentThemeColors.nodeFillCompleted, stroke: currentThemeColors.nodeStroke, dasharray: "0" },
      { label: "Unavailable", fill: currentThemeColors.nodeFillUnavailable, stroke: currentThemeColors.nodeStrokeUnavailable, dasharray: "2 2" }
    ];

    availabilityItems.forEach((item, i) => {
      const availItem = availabilityLegend.append("g")
        .attr("transform", `translate(0, ${22 + i * 22})`);

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
        .attr("font-size", 11)
        .attr("fill", currentThemeColors.legendText)
        .text(item.label);
    });

  }, [data, links, currentTransform, dimensions, theme]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} className="w-full h-full"></svg>
      {selectedModule && (
        <ModuleDetailsOverlay module={selectedModule} onClose={() => setSelectedModule(null)} theme={theme} />
      )}
    </div>
  );
} 