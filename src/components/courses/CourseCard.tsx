
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, ArchiveRestore, ChevronRight, Clock, Users } from "lucide-react";
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
      
      <HoverCardContent className="w-64 p-3">
        <div className="space-y-3">
          {/* Course Stats */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{courseData.totalStudents}</span>
            </div>
          </div>
          
          {/* Prerequisites - Only show if they exist and limit to 2 */}
          {courseData.prerequisites && courseData.prerequisites.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-1">Prerequisites</h4>
              <ul className="space-y-1">
                {courseData.prerequisites.slice(0, 2).map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                    <ChevronRight className="h-2.5 w-2.5 mt-0.5 flex-shrink-0 text-[#43BC88]" />
                    <span className="line-clamp-1">{prerequisite}</span>
                  </li>
                ))}
                {courseData.prerequisites.length > 2 && (
                  <li className="text-xs text-gray-500 italic">
                    +{courseData.prerequisites.length - 2} more
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Learning Objectives - Only show if they exist and limit to 2 */}
          {courseData.learningObjectives && courseData.learningObjectives.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-1">What you'll learn</h4>
              <ul className="space-y-1">
                {courseData.learningObjectives.slice(0, 2).map((objective, index) => (
                  <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                    <ChevronRight className="h-2.5 w-2.5 mt-0.5 flex-shrink-0 text-[#43BC88]" />
                    <span className="line-clamp-1">{objective}</span>
                  </li>
                ))}
                {courseData.learningObjectives.length > 2 && (
                  <li className="text-xs text-gray-500 italic">
                    +{courseData.learningObjectives.length - 2} more topics
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
