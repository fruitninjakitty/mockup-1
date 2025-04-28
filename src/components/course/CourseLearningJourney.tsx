
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, HelpCircle, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface LearningNode {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
  locked?: boolean;
}

interface CourseLearningJourneyProps {
  courseId: number;
}

export function CourseLearningJourney({ courseId }: CourseLearningJourneyProps) {
  // This would typically come from an API based on courseId
  // For now, we'll use static data but we're accepting the courseId prop for future enhancement
  const learningNodes: LearningNode[] = [
    { id: 1, title: `Introduction to Course ${courseId}`, completed: true, date: "Mar 1, 2024" },
    { id: 2, title: "Perfect Security", completed: true, date: "Mar 3, 2024" },
    { id: 3, title: "One-Time Pad", completed: true, date: "Mar 5, 2024" },
    { id: 4, title: "Computational Security", completed: false, date: null, locked: false },
    { id: 5, title: "Pseudo-Random Generators", completed: false, date: null, locked: true },
    { id: 6, title: "Advanced Cryptography", completed: false, date: null, locked: true },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Learning Journey</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Track your learning journey through the course</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4 mb-8">
        <Button className="w-full bg-secondary">Summarise My Learning</Button>
        <Button className="w-full bg-secondary">See polyline</Button>
        <Button className="w-full bg-secondary">Polylines List</Button>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <span className="text-sm font-medium">Learning Journey</span>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {learningNodes.map((node, index) => (
              <div key={node.id} className="relative pl-12">
                <div 
                  className={`absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center z-10 
                    ${node.locked 
                      ? "bg-gray-100 border border-gray-300" 
                      : node.completed 
                        ? "bg-[#43BC88] text-white" 
                        : "bg-white border-2 border-secondary"}`}
                >
                  {node.locked ? (
                    <Lock className="h-3 w-3 text-gray-400" />
                  ) : node.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  )}
                </div>
                
                <div className={`p-3 rounded-lg ${node.locked ? "bg-gray-50" : "bg-white border shadow-sm"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium ${node.locked ? "text-gray-400" : ""}`}>{node.title}</h3>
                      {node.date && <time className="text-xs text-gray-500">{node.date}</time>}
                    </div>
                    
                    {node.completed && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#43BC88] h-7 px-2">
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{node.title}</h4>
                            <p className="text-sm text-gray-600">
                              You completed this topic on {node.date}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <BookOpen className="h-3 w-3" />
                              <span>Resource: Lecture Notes</span>
                            </div>
                            <Button size="sm" className="w-full mt-2 bg-[#43BC88]">
                              View Resource
                            </Button>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </div>
                
                {index < learningNodes.length - 1 && (
                  <div className="absolute left-4 top-7 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
