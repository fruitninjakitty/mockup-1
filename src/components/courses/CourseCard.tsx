
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, ArchiveRestore } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
}

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

  return (
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
  );
}
