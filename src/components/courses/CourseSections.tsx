
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseList } from "@/components/courses/CourseList";
import { CreateCourseDialog } from "@/components/courses/CreateCourseDialog";
import { Course } from "@/types/course";
import { DisplayRole } from "@/types/roles";

interface CourseSectionsProps {
  activeCourses: Course[];
  archivedCourses: Course[];
  filteredActiveCourses: Course[];
  filteredArchivedCourses: Course[];
  courseView: string;
  setCourseView: (view: string) => void;
  handleArchiveToggle: (courseId: number, archive: boolean) => void;
  roles: DisplayRole[];
}

export function CourseSections({
  activeCourses,
  filteredActiveCourses,
  filteredArchivedCourses,
  courseView,
  setCourseView,
  handleArchiveToggle,
  roles
}: CourseSectionsProps) {
  // Check if any role has the required permissions
  const hasTeacherRights = roles.some(role => 
    role === "Teacher" || role === "Administrator"
  );
  
  const showRecommendedCourses = roles.includes("Learner");

  return (
    <>
      <section className="mb-12 fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Your Courses</h2>
          {hasTeacherRights && <CreateCourseDialog />}
        </div>
        
        <Tabs value={courseView} onValueChange={setCourseView} className="w-full">
          <div className="flex items-center justify-between mb-5">
            <TabsList className="grid w-[200px] grid-cols-2 bg-muted rounded-lg">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="active">
            <CourseList 
              courses={filteredActiveCourses}
              onArchiveToggle={handleArchiveToggle}
            />
          </TabsContent>
          
          <TabsContent value="archived">
            <CourseList 
              courses={filteredArchivedCourses}
              isArchived={true}
              onArchiveToggle={handleArchiveToggle}
            />
          </TabsContent>
        </Tabs>
      </section>

      {showRecommendedCourses && (
        <section className="fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recommended Courses</h2>
          </div>
          <CourseList 
            courses={activeCourses}
            onArchiveToggle={handleArchiveToggle}
          />
        </section>
      )}
    </>
  );
}
