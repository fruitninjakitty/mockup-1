
import { useState } from "react";
import { CoursesLayout } from "@/components/courses/CoursesLayout";
import { CourseSections } from "@/components/courses/CourseSections";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useProfileData } from "@/hooks/useProfileData";

export default function Courses() {
  const [courseView, setCourseView] = useState("active");
  
  const { activeCourses, archivedCourses, handleArchiveToggle } = useCourseManagement();
  const { roles, availableRoles, currentQuote, handleRoleChange } = useRoleManagement();
  const { userProfile, setUserProfile, isProfileOpen, setIsProfileOpen } = useProfileData();

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
