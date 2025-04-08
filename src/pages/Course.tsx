
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, HelpCircle, BookOpen, CheckCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";

export default function Course() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("Regions");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Sample initial profile - in a real app, this would come from a database
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    learningGoal: "professional",
    focusArea: "skills", 
    learningSchedule: "morning",
    bio: ""
  });

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // In a real app, you would also save this to a database
  };

  // Mock data for learning journey
  const learningNodes = [
    { id: 1, title: "Introduction", completed: true, date: "Mar 1, 2024" },
    { id: 2, title: "Perfect Security", completed: true, date: "Mar 3, 2024" },
    { id: 3, title: "One-Time Pad", completed: true, date: "Mar 5, 2024" },
    { id: 4, title: "Computational Security", completed: false, date: null, locked: false },
    { id: 5, title: "Pseudo-Random Generators", completed: false, date: null, locked: true },
    { id: 6, title: "Advanced Cryptography", completed: false, date: null, locked: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Foundations of Cryptography</h1>
              <p className="text-sm text-gray-600">
                Learn the basic paradigm and principles of modern cryptography
              </p>
            </div>
          </div>
          
          {/* Profile button - now same as in Courses.tsx */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsProfileOpen(true)}
          >
            <span className="sr-only">User menu</span>
            <div className="w-8 h-8 rounded-full bg-secondary text-white grid place-items-center">
              {userProfile.fullName ? userProfile.fullName.charAt(0) : "J"}
            </div>
          </Button>
        </div>
      </header>

      <ProfileDashboard 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        initialProfile={userProfile}
        onSave={handleProfileSave}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {["Regions", "Modules", "Topics", "Resources"].map((view) => (
                  <Button
                    key={view}
                    variant={selectedView === view ? "default" : "outline"}
                    onClick={() => setSelectedView(view)}
                    className={selectedView === view ? "bg-secondary" : ""}
                  >
                    {view}
                  </Button>
                ))}
              </div>
              {/* Enrolled courses dropdown removed as requested */}
            </div>

            <div className="aspect-square bg-gray-50 rounded-lg border relative">
              {/* This is where you'd implement the actual graph visualization */}
              <div className="absolute inset-0 grid place-items-center text-gray-400">
                Learning Map Visualization
              </div>
            </div>
          </div>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Learning Map</h2>
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
                      {/* Node icon */}
                      <div 
                        className={`absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center z-10 
                          ${node.locked 
                            ? "bg-gray-100 border border-gray-300" 
                            : node.completed 
                              ? "bg-primary text-white" 
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
                      
                      {/* Content */}
                      <div className={`p-3 rounded-lg ${node.locked ? "bg-gray-50" : "bg-white border shadow-sm"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-medium ${node.locked ? "text-gray-400" : ""}`}>{node.title}</h3>
                            {node.date && <time className="text-xs text-gray-500">{node.date}</time>}
                          </div>
                          
                          {node.completed && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-secondary h-7 px-2">
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
                                  <Button size="sm" className="w-full mt-2 bg-secondary">
                                    View Resource
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      </div>
                      
                      {/* Connector line to next node */}
                      {index < learningNodes.length - 1 && (
                        <div className="absolute left-4 top-7 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
