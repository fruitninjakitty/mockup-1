
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CalendarDays, School, Award, Clock, ChevronRight, Brain } from "lucide-react";
import { Course } from "@/types/course-types";

interface CourseDetailsProps {
  course: Course;
}

export function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
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
      </Card>
    </div>
  );
}
