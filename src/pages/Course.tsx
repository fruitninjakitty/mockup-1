
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/profile/ProfileDashboard";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseContent } from "@/components/course/CourseContent";
import { CoursePlaceholder } from "@/components/course/CoursePlaceholder";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import { useCourseData } from "@/hooks/useCourseData";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useProfileData } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const [selectedView, setSelectedView] = useState("Regions");
  const { toast } = useToast();
  
  // Use hooks for data fetching
  const courseData = useCourseData(id!);
  const { roles, availableRoles, currentQuote, handleRoleChange, isLoading: rolesLoading } = useRoleManagement();
  const { userProfile, setUserProfile, isProfileOpen, setIsProfileOpen, isLoading: profileLoading } = useProfileData();

  // Display loading state if any of the data is still loading
  if (rolesLoading || profileLoading || !courseData) {
    return (
      <CoursePlaceholder 
        message="Loading course..." 
        description="Please wait while we load your course data."
      />
    );
  }

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <CourseHeader 
        course={courseData}
        userProfile={userProfile}
        onProfileClick={() => setIsProfileOpen(true)}
        roles={roles}
        availableRoles={availableRoles}
        quote={currentQuote}
        onRoleChange={handleRoleChange}
      />

      <ProfileDashboard 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        initialProfile={userProfile}
        onSave={handleProfileSave}
      />

      <CourseContent
        selectedView={selectedView}
        onViewChange={setSelectedView}
        courseId={Number(id)}
        course={courseData}
      />
    </div>
  );
}
