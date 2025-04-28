
import React from 'react';
import { Course } from '@/types/course';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: Course[];
  isArchived?: boolean;
  onArchiveToggle: (courseId: number, archive: boolean) => void;
}

export function CourseList({ courses, isArchived = false, onArchiveToggle }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="col-span-3 text-center py-8">
        <p className="text-gray-500">
          No {isArchived ? 'archived' : 'active'} courses found for your role.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          isArchived={isArchived}
          onArchiveToggle={onArchiveToggle}
        />
      ))}
    </div>
  );
}
