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
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null); // Ref for D3 zoom behavior

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
      nodeStroke: '#fff',
      nodeStrokeUnavailable: '#999',
      linkStroke: '#999',
      labelFill: 'black',
      lockIconFill: '#333333',
      checkmarkFill: 'white',
      minimapBackground: 'rgba(255,255,255,0.8)',
      minimapStroke: '#333',
      minimapViewboxStroke: 'red',
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
      nodeStroke: '#212529',
      nodeStrokeUnavailable: '#adb5bd',
      linkStroke: '#adb5bd',
      labelFill: 'white',
      lockIconFill: '#e9ecef',
      checkmarkFill: 'black',
      minimapBackground: 'rgba(0,0,0,0.6)',
      minimapStroke: '#e9ecef',
      minimapViewboxStroke: 'cyan',
      legendText: 'white',
    },
    contrast: {
      background: '#000000',
      nodeFillAvailable: (difficulty: 'easy' | 'medium' | 'hard') => {
        const colorScale = d3.scaleOrdinal<string, string>()
          .domain(["easy", "medium", "hard"])
          .range(["#00ff00", "#ffff00", "#ff0000"]); // High contrast colors
        return colorScale(difficulty);
      },
      nodeFillCompleted: '#00ff00',
      nodeFillUnavailable: '#808080',
      nodeStroke: '#ffffff',
      nodeStrokeUnavailable: '#ffffff',
      linkStroke: '#ffffff',
      labelFill: '#ffffff',
      lockIconFill: '#ffffff',
      checkmarkFill: '#000000',
      minimapBackground: 'rgba(0,0,0,0.9)',
      minimapStroke: '#ffffff',
      minimapViewboxStroke: 'magenta',
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

    // TODO: Implement clustering logic here. Nodes should be clustered based on similarity.
    // For now, a simple grid layout is used to provide initial fixed positions.
    const nodes = data.map((d, i) => {
      // These coordinates can be replaced by a more sophisticated clustering algorithm
      // that assigns (x, y) based on similarity.
      const col = i % Math.ceil(Math.sqrt(data.length));
      const row = Math.floor(i / Math.ceil(Math.sqrt(data.length)));
      const spacing = 100; // Increased spacing for better visibility
      const numCols = Math.ceil(Math.sqrt(data.length));
      const numRows = Math.ceil(data.length / numCols);

      const gridWidth = numCols * spacing;
      const gridHeight = numRows * spacing;

      const offsetX = (width / 2) - (gridWidth / 2) + spacing / 2; // Center the grid
      const offsetY = (height / 2) - (gridHeight / 2) + spacing / 2;

      return {
        ...d,
        x: col * spacing + offsetX,
        y: row * spacing + offsetY,
        fx: col * spacing + offsetX, // Fix the nodes at these positions
        fy: row * spacing + offsetY,
      };
    });

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50));
      // Removed 'charge' and 'center' forces to keep nodes fixed.
      // The 'link' force will still run but won't cause movement due to fx/fy.

    // Define color scale for difficulty (now using theme-dependent function)
    const difficultyColor = currentThemeColors.nodeFillAvailable;

    const linkElements = g.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1)
      .attr("stroke", d => {
        const isPathLink = selectedPath &&
                           selectedPath.modules.includes((d.source as any).id) &&
                           selectedPath.modules.includes((d.target as any).id) &&
                           selectedPath.modules.indexOf((d.source as any).id) < selectedPath.modules.indexOf((d.target as any).id);
        return isPathLink ? "#1E90FF" : currentThemeColors.linkStroke; // DodgerBlue for path links
      })
      .attr("stroke-width", d => {
        const isPathLink = selectedPath &&
                           selectedPath.modules.includes((d.source as any).id) &&
                           selectedPath.modules.includes((d.target as any).id) &&
                           selectedPath.modules.indexOf((d.source as any).id) < selectedPath.modules.indexOf((d.target as any).id);
        return isPathLink ? 3 : 1; // Thicker for path links
      });

    const nodeElements = g.append("g")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes) // Changed from 'data' to 'nodes'
      .join("circle")
      .attr("r", 8)
      .attr("fill", d => {
        if (d.completed) return currentThemeColors.nodeFillCompleted;
        if (!d.available) return currentThemeColors.nodeFillUnavailable;
        return difficultyColor(d.difficulty);
      })
      .attr("stroke", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return "#FFD700"; // Gold for current module
        if (selectedPath && selectedPath.modules.includes(d.id)) return "#1E90FF"; // DodgerBlue for path nodes
        return d.available ? currentThemeColors.nodeStroke : currentThemeColors.nodeStrokeUnavailable;
      })
      .attr("stroke-width", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return 4; // Thicker stroke for current module
        if (selectedPath && selectedPath.modules.includes(d.id)) return 2.5; // Thicker stroke for path nodes
        return 1.5;
      })
      .attr("stroke-dasharray", d => d.available ? "0" : "2 2")
      .on("mouseover", function(event, d) {
        // Only highlight if not the current module in a guided path
        if (!(currentModuleInPath && d.id === currentModuleInPath.id)) {
          d3.select(this).attr("stroke", "#FFD700").attr("stroke-width", 3); // Highlight on hover
          labelElements.filter(p => p.id === d.id).attr("font-weight", "bold");
        }
      })
      .on("mouseout", function(event, d) {
        if (!(currentModuleInPath && d.id === currentModuleInPath.id)) {
          d3.select(this).attr("stroke", d.available ? currentThemeColors.nodeStroke : currentThemeColors.nodeStrokeUnavailable).attr("stroke-width", d => {
            if (selectedPath && selectedPath.modules.includes(d.id)) return 2.5; // Path node stroke
            return 1.5; // Default stroke
          });
          labelElements.filter(p => p.id === d.id).attr("font-weight", "normal");
        }
      })
      .on("click", function(event, d) {
        // Center the clicked node
        const currentZoomTransform = d3.zoomTransform(svg.node() as SVGSVGElement);
        const newX = -(d.x! * currentZoomTransform.k) + width / 2; // Use d.x and d.y directly
        const newY = -(d.y! * currentZoomTransform.k) + height / 2;
        svg.transition().duration(500).call(zoom.transform as any, d3.zoomIdentity.translate(newX, newY).scale(currentZoomTransform.k));

        // Select module for overlay
        setSelectedModule(d as ModuleData);
      });

    const labelElements = g.append("g")
      .selectAll("text")
      .data(nodes) // Changed from 'data' to 'nodes'
      .join("text")
      .text(d => d.name)
      .attr("font-size", (d) => currentTransform.k > 0.6 ? 10 : 0) // Adjust font size based on zoom, hide completely if too zoomed out
      .attr("fill", currentThemeColors.labelFill)
      .attr("dx", 10) // offset text from node
      .attr("dy", 3)
      .style("display", (d) => currentTransform.k > 0.6 ? "block" : "none"); // Hide labels when zoomed out too much

    const lockIcons = g.append("g")
      .selectAll("text")
      .data(nodes.filter(d => !d.available)) // Changed from 'data' to 'nodes'
      .join("text")
      .attr("font-family", "FontAwesome, sans-serif") // Requires FontAwesome to be available
      .attr("font-size", 12)
      .attr("fill", currentThemeColors.lockIconFill)
      .text("\uf023"); // FontAwesome lock icon

    const checkmarkIcons = g.append("g")
      .selectAll("text")
      .data(nodes.filter(d => d.completed && d.available)) // Changed from 'data' to 'nodes'
      .join("text")
      .attr("font-family", "FontAwesome, sans-serif") // Requires FontAwesome to be available
      .attr("font-size", 12)
      .attr("fill", currentThemeColors.checkmarkFill)
      .text("\uf00c"); // FontAwesome checkmark icon

    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("cx", d => (d as d3.SimulationNodeDatum).x!)
        .attr("cy", d => (d as d3.SimulationNodeDatum).y!)
        .attr("r", (d) => currentTransform.k * 8 > 5 ? 8 : (currentTransform.k * 8 < 3 ? 3 : currentTransform.k * 8)); // Adjust radius based on zoom
      labelElements
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!);
      lockIcons
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!); // Center the lock icon on the node
      checkmarkIcons
        .attr("x", d => (d as d3.SimulationNodeDatum).x!)
        .attr("y", d => (d as d3.SimulationNodeDatum).y!); // Center the checkmark on the node
    });

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5]) // Adjusted scale extent for more range
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setCurrentTransform(event.transform);
        updateMinimapViewbox(event.transform);
      });
    zoomRef.current = zoom; // Store zoom behavior in ref

    // Initial positioning based on currentModuleInPath (GPS-like indicator)
    if (currentModuleInPath) {
      const currentModuleDatum = currentModuleInPath as d3.SimulationNodeDatum;
      const initialX = -(currentModuleDatum.x! * currentTransform.k) + width / 2;
      const initialY = -(currentModuleDatum.y! * currentTransform.k) + height / 2;
      // Apply zoom directly using the zoom behavior, not by dispatching a WheelEvent
      svg.transition().duration(750).call(zoom.transform as any, d3.zoomIdentity.translate(initialX, initialY).scale(currentTransform.k));
    }

    // Minimap setup
    const minimapWidth = 200;
    const minimapHeight = 200;
    const allNodes = nodes as d3.SimulationNodeDatum[]; // Changed from 'data' to 'nodes'
    const xMin = d3.min(allNodes, d => d.x || 0) || 0;
    const xMax = d3.max(allNodes, d => d.x || 0) || 0;
    const yMin = d3.min(allNodes, d => d.y || 0) || 0;
    const yMax = d3.max(allNodes, d => d.y || 0) || 0;

    const graphWidth = xMax - xMin;
    const graphHeight = yMax - yMin;

    const minimapScale = Math.min(minimapWidth / graphWidth, minimapHeight / graphHeight); // Removed extra padding from scale calculation

    const minimap = svg.append("g")
      .attr("transform", `translate(${width - minimapWidth - 10}, ${height - minimapHeight - 10})`);

    // Minimap background
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

    // Draw minimap links
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
        return isPathLink ? "#1E90FF" : currentThemeColors.linkStroke; // DodgerBlue for path links
      })
      .attr("x1", (d: any) => (d.source.x - xMin) * minimapScale)
      .attr("y1", (d: any) => (d.source.y - yMin) * minimapScale)
      .attr("x2", (d: any) => (d.target.x - xMin) * minimapScale)
      .attr("y2", (d: any) => (d.target.y - yMin) * minimapScale);

    // Draw minimap nodes
    minimap.append("g")
      .selectAll("circle")
      .data(nodes) // Changed from 'data' to 'nodes'
      .join("circle")
      .attr("r", 3)
      .attr("fill", d => d.available ? currentThemeColors.nodeFillAvailable(d.difficulty) : currentThemeColors.nodeFillUnavailable)
      .attr("stroke", d => {
        if (currentModuleInPath && d.id === currentModuleInPath.id) return "#FFD700"; // Gold for current module
        if (selectedPath && selectedPath.modules.includes(d.id)) return "#1E90FF"; // DodgerBlue for path nodes
        return d.available ? currentThemeColors.nodeStroke : currentThemeColors.nodeStrokeUnavailable;
      })
      .attr("stroke-width", 0.5)
      .attr("cx", d => (d.x - xMin) * minimapScale)
      .attr("cy", d => (d.y - yMin) * minimapScale);

    // Minimap viewbox (represents the current zoom/pan area)
    const minimapViewbox = minimap.append("rect")
      .attr("class", "minimap-viewbox")
      .attr("stroke", currentThemeColors.minimapViewboxStroke)
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .style("pointer-events", "none"); // Prevent interaction

    // Function to update minimap viewbox
    function updateMinimapViewbox(transform: d3.ZoomTransform) {
      const viewboxX = (-transform.x / transform.k - xMin) * minimapScale;
      const viewboxY = (-transform.y / transform.k - yMin) * minimapScale;
      const viewboxWidth = (width / transform.k) * minimapScale;
      const viewboxHeight = (height / transform.k) * minimapScale;

      minimapViewbox
        .attr("x", viewboxX)
        .attr("y", viewboxY)
        .attr("width", viewboxWidth)
        .attr("height", viewboxHeight);
    }

    // Initial update of minimap viewbox
    updateMinimapViewbox(currentTransform);

    // Legend setup
    const legendData = [
      { label: "Easy", color: currentThemeColors.nodeFillAvailable('easy') },
      { label: "Medium", color: currentThemeColors.nodeFillAvailable('medium') },
      { label: "Hard", color: currentThemeColors.nodeFillAvailable('hard') },
      { label: "Completed", color: currentThemeColors.nodeFillCompleted },
      { label: "Unavailable", color: currentThemeColors.nodeFillUnavailable },
      { label: "Selected Path", color: "#1E90FF" },
      { label: "Current Module", color: "#FFD700" },
    ];

    const legendRectSize = 12;
    const legendSpacing = 4;

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(10, ${height - (legendData.length * (legendRectSize + legendSpacing) + 20)})`); // Dynamic positioning to prevent cutoff

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

    legendItems.append("rect")
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("fill", d => d.color);

    legendItems.append("text")
      .attr("x", legendRectSize + legendSpacing)
      .attr("y", legendRectSize / 2)
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .attr("fill", currentThemeColors.legendText)
      .text(d => d.label);

    // Event listeners to handle window resize for responsive SVG
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };

  }, [data, links, dimensions.width, dimensions.height, theme, selectedPath, currentModuleInPath, currentTransform]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition().duration(250)
        .call(zoomRef.current.scaleBy as any, 1.2);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition().duration(250)
        .call(zoomRef.current.scaleBy as any, 0.8);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
      <div style={{ // Zoom buttons container
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: '10px',
        borderRadius: '5px',
        display: 'flex',
        gap: '10px',
        zIndex: 1000,
      }}>
        <button onClick={handleZoomIn} style={{ padding: '5px 10px', cursor: 'pointer' }}>+</button>
        <button onClick={handleZoomOut} style={{ padding: '5px 10px', cursor: 'pointer' }}>-</button>
      </div>
      {selectedModule && (
        <ModuleDetailsOverlay
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          theme={theme}
        />
      )}
    </div>
  );
} 