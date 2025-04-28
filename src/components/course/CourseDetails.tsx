
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CalendarDays, School } from "lucide-react";
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Instructor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.createdBy ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center">
                  {course.createdBy.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{course.createdBy.fullName}</p>
                  <p className="text-xs text-gray-500">{course.createdBy.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Course Creator</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Instructor information not available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
