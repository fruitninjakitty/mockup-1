
import { Button } from "@/components/ui/button";

interface CourseLearningMapProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

export function CourseLearningMap({ selectedView, onViewChange }: CourseLearningMapProps) {
  const views = ["Regions", "Modules", "Topics", "Resources"];

  return (
    <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {views.map((view) => (
            <Button
              key={view}
              variant={selectedView === view ? "default" : "outline"}
              onClick={() => onViewChange(view)}
              className={selectedView === view ? "bg-secondary" : ""}
            >
              {view}
            </Button>
          ))}
        </div>
      </div>

      <div className="aspect-square bg-gray-50 rounded-lg border relative">
        <div className="absolute inset-0 grid place-items-center text-gray-400">
          Learning Map Visualization
        </div>
      </div>
    </div>
  );
}
