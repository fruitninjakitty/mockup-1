
import { useState } from "react";
import { CoursesLayout } from "@/components/courses/CoursesLayout";
import { CourseSections } from "@/components/courses/CourseSections";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useProfileData } from "@/hooks/useProfileData";
import { CoursePlaceholder } from "@/components/course/CoursePlaceholder";

export default function Courses() {
  const [courseView, setCourseView] = useState("active");
  
  // Use hooks for data fetching
  const { activeCourses, archivedCourses, handleArchiveToggle, loading: coursesLoading } = useCourseManagement();
  const { roles, availableRoles, currentQuote, handleRoleChange, isLoading: rolesLoading } = useRoleManagement();
  const { userProfile, setUserProfile, isProfileOpen, setIsProfileOpen, isLoading: profileLoading } = useProfileData();

  // Show loading state if any data is still loading
  if (coursesLoading || rolesLoading || profileLoading) {
    return (
      <CoursePlaceholder 
        message="Loading courses..." 
        description="Please wait while we load your courses."
      />
    );
  }

  // Filter courses based on user roles
  const filteredActiveCourses = activeCourses.filter(course => 
    !course.roles || roles.some(role => course.roles?.includes(role))
  );

  const filteredArchivedCourses = archivedCourses.filter(course => 
    !course.roles || roles.some(role => course.roles?.includes(role))
  );

  return (
    <CoursesLayout
      roles={roles}
      availableRoles={availableRoles}
      currentQuote={currentQuote}
      onRoleChange={handleRoleChange}
      userProfile={userProfile}
      isProfileOpen={isProfileOpen}
      onProfileClose={() => setIsProfileOpen(false)}
      onProfileClick={() => setIsProfileOpen(true)}
      onProfileSave={setUserProfile}
    >
      <CourseSections
        activeCourses={activeCourses}
        archivedCourses={archivedCourses}
        filteredActiveCourses={filteredActiveCourses}
        filteredArchivedCourses={filteredArchivedCourses}
        courseView={courseView}
        setCourseView={setCourseView}
        handleArchiveToggle={handleArchiveToggle}
        roles={roles}
      />
    </CoursesLayout>
  );
}
