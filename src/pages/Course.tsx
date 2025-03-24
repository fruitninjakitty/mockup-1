
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Course() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("Regions");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
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
      </header>

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Enrolled Courses <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Cryptography</DropdownMenuItem>
                  <DropdownMenuItem>Network Science</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-secondary">Summarise My Learning</Button>
              <Button className="w-full bg-secondary">See polyline</Button>
              <Button className="w-full bg-secondary">Polylines List</Button>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm font-medium">Learning Timeline</span>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-secondary rounded-full transform -translate-x-[5px]"></div>
                    <time className="text-sm text-gray-500">Mar 3, 2024</time>
                    <h3 className="font-medium">Perfect Security</h3>
                    <a href="#" className="text-sm text-secondary hover:underline">
                      View Resource
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
