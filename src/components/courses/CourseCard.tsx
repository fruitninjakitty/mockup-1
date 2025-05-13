
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, ArchiveRestore, ChevronRight } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  isArchived?: boolean;
  onArchiveToggle: (courseId: number, archive: boolean) => void;
}

export function CourseCard({ course, isArchived = false, onArchiveToggle }: CourseCardProps) {
  const navigate = useNavigate();

  const handleArchiveToggle = () => {
    onArchiveToggle(course.id, !isArchived);
  };

  // Fallback values for missing data
  const courseData = {
    ...course,
    skillLevel: course.skillLevel || "All Levels",
    duration: course.duration || "Self-paced",
    totalStudents: course.totalStudents || 0,
    prerequisites: course.prerequisites || [],
    learningObjectives: course.learningObjectives || []
  };

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Card className={`minimal-card card-gradient transition-transform hover:scale-105 ${isArchived ? 'bg-muted opacity-80' : ''}`}>
          <CardHeader>
            <img
              src={course.image}
              alt={course.title}
              className={`w-full h-44 object-cover rounded-xl mb-2 ${isArchived ? 'opacity-80' : ''}`}
            />
          </CardHeader>
          <CardContent>
            <CardTitle className={`text-lg ${isArchived ? 'text-gray-600' : ''}`}>
              {course.title}
            </CardTitle>
            <CardDescription className={isArchived ? 'text-gray-500' : ''}>
              {course.description}
            </CardDescription>
            <div className="flex justify-between mt-3">
              <Button
                variant={isArchived ? 'outline' : 'default'}
                className={`w-5/6 ${!isArchived ? 'bg-secondary text-white font-semibold shadow hover:bg-secondary/90' : ''}`}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                {isArchived ? 'View Course' : 'Continue Learning'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                title={isArchived ? 'Unarchive Course' : 'Archive Course'}
                className="border-gray-200"
                onClick={handleArchiveToggle}
              >
                {isArchived ? 
                  <ArchiveRestore className="h-4 w-4 text-secondary" /> : 
                  <Archive className="h-4 w-4 text-gray-400" />
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-4">
          {courseData.duration && (
            <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
              <span className="font-medium">Duration:</span> {courseData.duration}
            </p>
          )}
          
          {courseData.totalStudents !== undefined && (
            <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
              <span className="font-medium">Students Enrolled:</span> {courseData.totalStudents}
            </p>
          )}
          
          {courseData.prerequisites && courseData.prerequisites.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Prerequisites</h4>
              <ul className="space-y-1">
                {courseData.prerequisites.slice(0, 3).map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                    <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-[#43BC88]" />
                    <span>{prerequisite}</span>
                  </li>
                ))}
                {courseData.prerequisites.length > 3 && (
                  <li className="text-xs text-gray-500 italic">
                    +{courseData.prerequisites.length - 3} more prerequisites
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {courseData.learningObjectives && courseData.learningObjectives.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Learning Objectives</h4>
              <ul className="space-y-1">
                {courseData.learningObjectives.slice(0, 2).map((objective, index) => (
                  <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                    <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-[#43BC88]" />
                    <span>{objective}</span>
                  </li>
                ))}
                {courseData.learningObjectives.length > 2 && (
                  <li className="text-xs text-gray-500 italic">
                    +{courseData.learningObjectives.length - 2} more objectives
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
