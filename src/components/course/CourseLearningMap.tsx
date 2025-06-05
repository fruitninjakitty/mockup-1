import { CourseViewState } from "@/types/course-types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GraphCanvas, darkTheme, lightTheme } from 'reagraph';
import { useMemo, useRef, useEffect } from 'react';

interface CourseLearningMapProps extends CourseViewState {}

export function CourseLearningMap({ selectedView, onViewChange }: CourseLearningMapProps) {
  const graphRef = useRef<any>(null);

  const nodes = useMemo(() => [
    { id: 'start', label: 'START', data: { color: '#3182CE', x: -300, y: 150 } }, // START node
    { id: 'path_node1', label: '\uD83D\uDCDA', data: { color: '#3182CE', x: -100, y: 150 } }, // Book icon
    { id: 'path_node2', label: '\u25CF', data: { color: '#3182CE', x: 0, y: 0 } }, // Blue dot
    { id: 'path_node3', label: '\u25B6', data: { color: '#D3D3D3', x: 100, y: -50 } }, // Play icon
    { id: 'path_node4', label: '\u2713', data: { color: '#D3D3D3', x: 200, y: 0 } }, // Checkmark
    { id: 'pathA_node1', label: '\u2713', data: { color: '#3182CE', x: 300, y: -150 } }, // Checkmark (Path A)

    { id: 'pathB_node1', label: '\u2713', data: { color: '#4CAF50', x: 400, y: -100 } }, // Checkmark (Path B)
    { id: 'pathB_node2', label: '\u2713', data: { color: '#4CAF50', x: 500, y: -50 } }, // Checkmark (Path B)
    { id: 'endB', label: 'END', data: { color: '#4CAF50', x: 600, y: -50 } }, // END (Path B)

    { id: 'pathC_node1', label: '\u2713', data: { color: '#FF9800', x: 400, y: 100 } }, // Checkmark (Path C)
    { id: 'pathC_node2', label: '\uD83D\uDCDA', data: { color: '#FF9800', x: 500, y: 150 } }, // Book icon (Path C)
    { id: 'endC', label: 'END', data: { color: '#FF9800', x: 600, y: 100 } }, // END (Path C)

    { id: 'path_node5', label: '\u2713', data: { color: '#D3D3D3', x: 100, y: 200 } }, // Checkmark
    { id: 'path_node6', label: '\u2713', data: { color: '#4CAF50', x: 200, y: 250 } }, // Checkmark (Path Green)
  ], []);

  const edges = useMemo(() => [
    { id: 'edge-start-path_node1', source: 'start', target: 'path_node1', data: { color: '#3182CE' } },
    { id: 'edge-path_node1-path_node2', source: 'path_node1', target: 'path_node2', data: { color: '#3182CE' } },
    { id: 'edge-path_node2-path_node3', source: 'path_node2', target: 'path_node3', data: { color: '#D3D3D3' } },
    { id: 'edge-path_node3-path_node4', source: 'path_node3', target: 'path_node4', data: { color: '#D3D3D3' } },
    { id: 'edge-path_node4-pathA_node1', source: 'path_node4', target: 'pathA_node1', data: { color: '#3182CE' } },

    { id: 'edge-pathA_node1-pathB_node1', source: 'pathA_node1', target: 'pathB_node1', data: { color: '#4CAF50' } },
    { id: 'edge-pathB_node1-pathB_node2', source: 'pathB_node1', target: 'pathB_node2', data: { color: '#4CAF50' } },
    { id: 'edge-pathB_node2-endB', source: 'pathB_node2', target: 'endB', data: { color: '#4CAF50' } },

    { id: 'edge-path_node4-pathC_node1', source: 'path_node4', target: 'pathC_node1', data: { color: '#FF9800' } },
    { id: 'edge-pathC_node1-pathC_node2', source: 'pathC_node1', target: 'pathC_node2', data: { color: '#FF9800' } },
    { id: 'edge-pathC_node2-endC', source: 'pathC_node2', target: 'endC', data: { color: '#FF9800' } },

    { id: 'edge-path_node2-path_node5', source: 'path_node2', target: 'path_node5', data: { color: '#D3D3D3' } },
    { id: 'edge-path_node5-path_node6', source: 'path_node5', target: 'path_node6', data: { color: '#4CAF50' } },
  ], []);

  // Fit the graph to the view when nodes or edges change
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.fitView();
    }
  }, [nodes, edges]);

  return (
    <div className="lg:col-span-2 relative h-[600px] w-full rounded-lg shadow-sm overflow-hidden bg-background/50 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Tabs value={selectedView} onValueChange={onViewChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Regions">Regions</TabsTrigger>
            <TabsTrigger value="Graph">Graph</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {selectedView === 'Graph' && (
        <div className="relative h-full w-full">
          <GraphCanvas
            ref={graphRef}
            nodes={nodes}
            edges={edges}
            layoutType="forceDirected2d"
            theme={darkTheme}
            draggable
            cameraMode="rotate"
            edgeArrowPosition="none"
            edgeInterpolation="straight"
            camera={{
              zoom: 1,
              x: 0,
              y: 0,
              z: 0
            }}
            nodeSize={{
              width: 60,
              height: 60
            }}
            nodeColor={(node) => node.data?.color || '#D3D3D3'}
            edgeColor={(edge) => edge.data?.color || '#D3D3D3'}
            emptyGraphText="No learning map data available."
            nodeLabelsData={nodes.map(node => ({
              id: node.id,
              label: node.label,
              fontSize: node.id === 'start' || node.id === 'endB' || node.id === 'endC' ? 16 : 24, // Adjust font size for icons
              y: node.id === 'start' || node.id === 'endB' || node.id === 'endC' ? 0 : 5 // Adjust y position for icons
            }))}
          />
        </div>
      )}
      {selectedView === 'Regions' && (
        <div className="text-muted-foreground mt-20">
          <h3 className="text-lg font-semibold">Learning Map Visualization</h3>
          <p>Select 'Graph' to view the node-based learning map.</p>
        </div>
      )}
    </div>
  );
}
