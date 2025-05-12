
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
  const courseData = useCourseData(id!);
  const { toast } = useToast();
  
  // Use role management hook for consistent role handling
  const { roles, availableRoles, currentQuote, handleRoleChange } = useRoleManagement();
  
  // Use profile data hook for consistent profile handling
  const { userProfile, setUserProfile, isProfileOpen, setIsProfileOpen } = useProfileData();

  // Load stored profile if it exists in localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing stored profile:", error);
        toast({
          title: "Error",
          description: "Could not load your profile data",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  if (!courseData) {
    return (
      <CoursePlaceholder 
        message="Loading course..." 
        description="Please wait while we load your course data."
      />
    );
  }

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
