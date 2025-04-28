
import { CourseLearningMap } from "./CourseLearningMap";
import { CourseLearningJourney } from "./CourseLearningJourney";
import { CourseViewState } from "@/types/course-types";

interface CourseContentProps extends CourseViewState {
  courseId: number;
}

export function CourseContent({ selectedView, onViewChange, courseId }: CourseContentProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CourseLearningMap
          selectedView={selectedView}
          onViewChange={onViewChange}
        />
        <CourseLearningJourney courseId={courseId} />
      </div>
    </main>
  );
}
