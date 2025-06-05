import { Button } from "@/components/ui/button";
import { LearningMapVisualization, ModuleData, LinkData } from "./LearningMapVisualization";

interface CourseLearningMapProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

// Define dummy module data for demonstration
const dummyModules: ModuleData[] = [
  { id: "mod1", name: "Intro to CS", difficulty: "easy", available: true },
  { id: "mod2", name: "Data Structures", difficulty: "medium", available: true },
  { id: "mod3", name: "Web Dev Basics", difficulty: "easy", available: true },
  { id: "mod4", name: "Databases", difficulty: "hard", available: false },
  { id: "mod5", name: "OOP Principles", difficulty: "medium", available: true },
  { id: "mod6", name: "Adv. JavaScript", difficulty: "medium", available: true },
  { id: "mod7", name: "Frontend Frameworks", difficulty: "hard", available: false },
  { id: "mod8", name: "Backend Dev", difficulty: "hard", available: true },
  { id: "mod9", name: "Cloud Fundamentals", difficulty: "easy", available: false },
  { id: "mod10", name: "ML Basics", difficulty: "hard", available: true },
  { id: "mod11", name: "Algorithms Design", difficulty: "hard", available: true },
  { id: "mod12", name: "Network Security", difficulty: "hard", available: false },
  { id: "mod13", name: "UI/UX Design", difficulty: "easy", available: true },
  { id: "mod14", name: "Mobile App Dev", difficulty: "medium", available: true },
  { id: "mod15", name: "Software Testing", difficulty: "medium", available: false },
  { id: "mod16", name: "DevOps Practices", difficulty: "hard", available: true },
  { id: "mod17", name: "Big Data Analytics", difficulty: "hard", available: false },
  { id: "mod18", name: "Cybersecurity Intro", difficulty: "medium", available: true },
  { id: "mod19", name: "Game Development", difficulty: "easy", available: true },
  { id: "mod20", name: "AI Ethics", difficulty: "medium", available: false },
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
  { source: "mod2", target: "mod11" },
  { source: "mod3", target: "mod13" },
  { source: "mod6", target: "mod14" },
  { source: "mod8", target: "mod16" },
  { source: "mod4", target: "mod17" },
  { source: "mod5", target: "mod15" },
  { source: "mod10", target: "mod20" },
  { source: "mod11", target: "mod12" },
  { source: "mod13", target: "mod14" },
  { source: "mod18", target: "mod12" },
  { source: "mod1", target: "mod19" },
  { source: "mod14", target: "mod19" },
  { source: "mod16", target: "mod17" },
  { source: "mod18", target: "mod4" },
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
