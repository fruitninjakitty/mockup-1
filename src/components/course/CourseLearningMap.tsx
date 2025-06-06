import { Button } from "@/components/ui/button";
import { LearningMapVisualization, ModuleData, LinkData } from "./LearningMapVisualization";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext"; // Import useTheme hook
import { Sun, Moon, CircleDot } from "lucide-react"; // Import icons

interface CourseLearningMapProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

interface LearningPath {
  id: string;
  name: string;
  modules: string[]; // Ordered array of module IDs in the path
}

// Define dummy module data for demonstration
const dummyModules: ModuleData[] = [
  { id: "mod1", name: "Intro to CS", difficulty: "easy", available: true, completed: true, content: { type: 'text', value: 'This module introduces fundamental concepts of computer science.' } },
  { id: "mod2", name: "Data Structures", difficulty: "medium", available: true, completed: false, content: { type: 'text', value: 'Learn about arrays, linked lists, trees, and graphs.' } },
  { id: "mod3", name: "Web Dev Basics", difficulty: "easy", available: true, completed: true, content: { type: 'text', value: 'An introduction to HTML, CSS, and basic JavaScript for web development.' } },
  { id: "mod4", name: "Databases", difficulty: "hard", available: false, completed: false, content: { type: 'text', value: 'Explore relational databases, SQL, and NoSQL concepts.' } },
  { id: "mod5", name: "OOP Principles", difficulty: "medium", available: true, completed: true, content: { type: 'text', value: 'Understand encapsulation, inheritance, polymorphism, and abstraction.' } },
  { id: "mod6", name: "Adv. JavaScript", difficulty: "medium", available: true, completed: false, content: { type: 'text', value: 'Dive deeper into JavaScript, including asynchronous programming and ES6 features.' } },
  { id: "mod7", name: "Frontend Frameworks", difficulty: "hard", available: false, completed: false, content: { type: 'text', value: 'Introduction to modern frontend frameworks like React and Vue.' } },
  { id: "mod8", name: "Backend Dev", difficulty: "hard", available: true, completed: true, content: { type: 'text', value: 'Learn about server-side programming, APIs, and backend architectures.' } },
  { id: "mod9", name: "Cloud Fundamentals", difficulty: "easy", available: false, completed: false, content: { type: 'text', value: 'Basic concepts of cloud computing, including IaaS, PaaS, and SaaS.' } },
  { id: "mod10", name: "ML Basics", difficulty: "hard", available: true, completed: false, content: { type: 'text', value: 'An introduction to machine learning algorithms and concepts.' } },
  { id: "mod11", name: "Algorithms Design", difficulty: "hard", available: true, completed: true, content: { type: 'text', value: 'Techniques for designing efficient algorithms, including dynamic programming.' } },
  { id: "mod12", name: "Network Security", difficulty: "hard", available: false, completed: false, content: { type: 'text', value: 'Fundamentals of network security, firewalls, and intrusion detection.' } },
  { id: "mod13", name: "UI/UX Design", difficulty: "easy", available: true, completed: true, content: { type: 'text', value: 'Principles of user interface and user experience design.' } },
  { id: "mod14", name: "Mobile App Dev", difficulty: "medium", available: true, completed: false, content: { type: 'text', value: 'Building mobile applications for iOS and Android platforms.' } },
  { id: "mod15", name: "Software Testing", difficulty: "medium", available: false, completed: false, content: { type: 'text', value: 'Learn about different testing methodologies, including unit and integration testing.' } },
  { id: "mod16", name: "DevOps Practices", difficulty: "hard", available: true, completed: true, content: { type: 'text', value: 'Introduction to DevOps culture, practices, and tools.' } },
  { id: "mod17", name: "Big Data Analytics", difficulty: "hard", available: false, completed: false, content: { type: 'text', value: 'Analyzing large datasets using tools like Hadoop and Spark.' } },
  { id: "mod18", name: "Cybersecurity Intro", difficulty: "medium", available: true, completed: true, content: { type: 'text', value: 'An overview of cybersecurity threats, vulnerabilities, and defenses.' } },
  { id: "mod19", name: "Game Development", difficulty: "easy", available: true, completed: false, content: { type: 'text', value: 'Fundamentals of game design and development using a game engine.' } },
  { id: "mod20", name: "AI Ethics", difficulty: "medium", available: false, completed: false, content: { type: 'text', value: 'Exploring the ethical implications and societal impact of artificial intelligence.' } },
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

const predefinedPaths: LearningPath[] = [
  {
    id: "path1",
    name: "Foundational Programming",
    modules: ["mod1", "mod2", "mod5", "mod6", "mod8"],
  },
  {
    id: "path2",
    name: "Web Development Journey",
    modules: ["mod1", "mod3", "mod6", "mod7", "mod8", "mod13", "mod14"],
  },
  {
    id: "path3",
    name: "Data Science Explorer",
    modules: ["mod1", "mod2", "mod10", "mod11", "mod17", "mod20"],
  },
  {
    id: "path4",
    name: "Cybersecurity Basics",
    modules: ["mod1", "mod18", "mod12", "mod4"],
  },
];

export function CourseLearningMap({ selectedView, onViewChange }: CourseLearningMapProps) {
  const views = ["Regions", "Modules", "Topics", "Resources"];
  const { theme, toggleTheme } = useTheme(); // Consume theme from context
  const [navigationMode, setNavigationMode] = useState<'free' | 'guided'>('free');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);

  const selectedPath = selectedPathId
    ? predefinedPaths.find((p) => p.id === selectedPathId)
    : null;

  const currentModuleInPath = selectedPath
    ? dummyModules.find((m) => m.id === selectedPath.modules[currentModuleIndex])
    : null;

  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
    setNavigationMode('guided');
    setCurrentModuleIndex(0);
  };

  const handleNextModule = () => {
    if (selectedPath && currentModuleIndex < selectedPath.modules.length - 1) {
      setCurrentModuleIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevModule = () => {
    if (selectedPath && currentModuleIndex > 0) {
      setCurrentModuleIndex(prevIndex => prevIndex - 1);
    }
  };

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
        <Button 
          onClick={toggleTheme} 
          variant="ghost" 
          size="icon"
          className="h-10 w-10"
          title={`Current theme: ${theme}`}
        >
          {theme === 'light' ? (
            <Sun className="h-5 w-5" />
          ) : theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <CircleDot className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="mb-4">
        <Button
          onClick={() => {
            setNavigationMode('free');
            setSelectedPathId(null);
            setCurrentModuleIndex(0);
          }}
          variant={navigationMode === 'free' ? "default" : "outline"}
          className="mr-2"
        >
          Free Exploration
        </Button>
        <select onChange={(e) => handlePathSelect(e.target.value)} value={selectedPathId || ''}>
          <option value="">Select Guided Path</option>
          {predefinedPaths.map((path) => (
            <option key={path.id} value={path.id}>
              {path.name}
            </option>
          ))}
        </select>
        {navigationMode === 'guided' && selectedPath && (
          <div className="mt-2 flex items-center">
            <Button onClick={handlePrevModule} disabled={currentModuleIndex === 0} className="mr-2">
              Previous Module
            </Button>
            <Button onClick={handleNextModule} disabled={currentModuleIndex === selectedPath.modules.length - 1}>
              Next Module
            </Button>
            <span className="ml-4 text-sm">
              Current: {currentModuleInPath?.name || 'N/A'} ({currentModuleIndex + 1} of {selectedPath.modules.length})
            </span>
          </div>
        )}
      </div>

      <div className="aspect-square bg-gray-50 rounded-lg border relative">
        <LearningMapVisualization
          data={dummyModules}
          links={dummyLinks}
          theme={theme}
          selectedPath={selectedPath}
          currentModuleInPath={currentModuleInPath}
        />
      </div>
    </div>
  );
}
