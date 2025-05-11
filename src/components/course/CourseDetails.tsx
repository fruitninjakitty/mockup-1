
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CalendarDays, School, Award, Clock, ChevronRight, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { Course } from "@/types/course-types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface CourseDetailsProps {
  course: Course;
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    courseInfo: false,
    learningObjectives: false,
    prerequisites: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ 
      ...prev, 
      [section]: !prev[section] 
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Course Information Card */}
      <Card>
        <Collapsible open={openSections.courseInfo}>
          <CardHeader className="pb-0">
            <CollapsibleTrigger asChild onClick={() => toggleSection("courseInfo")}>
              <div className="flex justify-between items-center w-full cursor-pointer">
                <CardTitle className="text-lg font-semibold">Course Information</CardTitle>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  {openSections.courseInfo ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Learning Objectives Card */}
      <Card>
        <Collapsible open={openSections.learningObjectives}>
          <CardHeader className="pb-0">
            <CollapsibleTrigger asChild onClick={() => toggleSection("learningObjectives")}>
              <div className="flex justify-between items-center w-full cursor-pointer">
                <CardTitle className="text-lg font-semibold">Learning Objectives</CardTitle>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  {openSections.learningObjectives ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-4">
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Prerequisites Card */}
      <Card className="md:col-span-2">
        <Collapsible open={openSections.prerequisites}>
          <CardHeader className="pb-0">
            <CollapsibleTrigger asChild onClick={() => toggleSection("prerequisites")}>
              <div className="flex justify-between items-center w-full cursor-pointer">
                <CardTitle className="text-lg font-semibold">Prerequisites</CardTitle>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  {openSections.prerequisites ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-4">
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
