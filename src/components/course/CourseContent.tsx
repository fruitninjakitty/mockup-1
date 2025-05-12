
import { CourseLearningMap } from "./CourseLearningMap";
import { CourseLearningJourney } from "./CourseLearningJourney";
import { CourseViewState, Course } from "@/types/course-types";

interface CourseContentProps extends CourseViewState {
  courseId: number;
  course: Course;
}

export function CourseContent({ selectedView, onViewChange, courseId, course }: CourseContentProps) {
  return (
    <div className="space-y-8">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CourseLearningMap
            selectedView={selectedView}
            onViewChange={onViewChange}
          />
          <CourseLearningJourney courseId={courseId} />
        </div>
      </main>
      
      {/* Course Details moved to bottom */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-background/50 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-center py-4">Course Details</h2>
          <div className="border-t border-border">
            <CourseDetails course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { CourseDetails } from "./CourseDetails";
