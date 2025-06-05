import { Button } from "@/components/ui/button";
import { LearningMapVisualization } from "./LearningMapVisualization";

interface CourseLearningMapProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

// Define dummy module data for demonstration
const dummyModules = [
  { id: "mod1", name: "Introduction to Programming" },
  { id: "mod2", name: "Data Structures and Algorithms" },
  { id: "mod3", name: "Web Development Basics" },
  { id: "mod4", name: "Database Management" },
  { id: "mod5", name: "Object-Oriented Programming" },
];

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
        <LearningMapVisualization data={dummyModules} />
      </div>
    </div>
  );
}
