
import { useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/profile/ProfileDashboard";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseContent } from "@/components/course/CourseContent";
import { CoursePlaceholder } from "@/components/course/CoursePlaceholder";
import { CourseDetails } from "@/components/course/CourseDetails";
import { ProfileDashboard } from "@/components/profile/ProfileDashboard";
import { useCourseData } from "@/hooks/useCourseData";

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const [selectedView, setSelectedView] = useState("Regions");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const courseData = useCourseData(id!);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    fullName: "John Doe",
    email: "john.doe@example.com",
    userRoles: ["Learner"],
    schoolCode: "",
    learningGoal: "professional",
    focusArea: "skills", 
    learningSchedule: "morning",
    bio: ""
  });

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
      />

      <div className="container mx-auto px-4 py-8">
        <CourseDetails course={courseData} />
      </div>

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
      />
    </div>
  );
}
