import { Button } from "@/components/ui/button";
import { LearningMapVisualization, ModuleData, LinkData } from "./LearningMapVisualization";

interface CourseLearningMapProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

// Define dummy module data for demonstration
const dummyModules: ModuleData[] = [
  { id: "mod1", name: "Introduction to Programming", difficulty: "easy", available: true },
  { id: "mod2", name: "Data Structures and Algorithms", difficulty: "medium", available: true },
  { id: "mod3", name: "Web Development Basics", difficulty: "easy", available: true },
  { id: "mod4", name: "Database Management", difficulty: "hard", available: false },
  { id: "mod5", name: "Object-Oriented Programming", difficulty: "medium", available: true },
  { id: "mod6", name: "Advanced JavaScript", difficulty: "medium", available: true },
  { id: "mod7", name: "Frontend Frameworks", difficulty: "hard", available: false },
  { id: "mod8", name: "Backend Development", difficulty: "hard", available: true },
  { id: "mod9", name: "Cloud Computing Fundamentals", difficulty: "easy", available: false },
  { id: "mod10", name: "Machine Learning Basics", difficulty: "hard", available: true },
];

const dummyLinks: LinkData[] = [
  { source: "mod1", target: "mod2" },
  { source: "mod1", target: "mod3" },
  { source: "mod2", target: "mod5" },
  { source: "mod3", target: "mod6" },
  { source: "mod6", target: "mod7" },
  { source: "mod6", target: "mod8" },
  { source: "mod5", target: "mod8" },
  { source: "mod8", target: "mod4" },
  { source: "mod2", target: "mod10" },
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
        <LearningMapVisualization data={dummyModules} links={dummyLinks} />
      </div>
    </div>
  );
}
