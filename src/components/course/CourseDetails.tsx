
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, CalendarDays, School, Award, Clock, ChevronRight, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { Course } from "@/types/course-types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CourseDetailsProps {
  course: Course;
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex justify-between items-center w-full cursor-pointer p-4" onClick={() => setIsOpen(!isOpen)}>
          <h3 className="text-lg font-medium">Course Details</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Course Information */}
            <div className="mb-6">
              <h4 className="font-semibold text-base mb-3">Course Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <School className="h-4 w-4" />
                  <span>School Code: {course.schoolCode || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4" />
                  <span>Created: {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{course.totalStudents || 0} Enrolled Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="h-4 w-4" />
                  <span>Level: {course.skillLevel || "All Levels"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {course.duration || "Self-paced"}</span>
                </div>
                {course.certification && (
                  <div className="flex items-center gap-2 text-sm text-[#43BC88]">
                    <Award className="h-4 w-4" />
                    <span>Certificate Available</span>
                  </div>
                )}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Learning Objectives */}
            <div className="mb-6">
              <h4 className="font-semibold text-base mb-3">Learning Objectives</h4>
              {course.learningObjectives ? (
                <ul className="space-y-2">
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <ChevronRight className="h-4 w-4 mt-1 flex-shrink-0 text-[#43BC88]" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No learning objectives specified</p>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Prerequisites */}
            <div>
              <h4 className="font-semibold text-base mb-3">Prerequisites</h4>
              {course.prerequisites ? (
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <ChevronRight className="h-4 w-4 mt-1 flex-shrink-0 text-[#43BC88]" />
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No prerequisites required</p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
