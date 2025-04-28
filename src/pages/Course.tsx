
import { useState, useEffect } from "react";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseLearningMap } from "@/components/course/CourseLearningMap";
import { CourseLearningJourney } from "@/components/course/CourseLearningJourney";

export default function Course() {
  const [selectedView, setSelectedView] = useState("Regions");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    fullName: "John Doe",
    email: "john.doe@example.com",
    userType: "student",
    schoolCode: "",
    learningGoal: "professional",
    focusArea: "skills", 
    learningSchedule: "morning",
    bio: ""
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(prev => ({ ...prev, ...JSON.parse(storedProfile) }));
    }
  }, []);

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <CourseHeader 
        userProfile={userProfile}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <ProfileDashboard 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        initialProfile={userProfile}
        onSave={handleProfileSave}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CourseLearningMap
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />
          <CourseLearningJourney />
        </div>
      </main>
    </div>
  );
}
