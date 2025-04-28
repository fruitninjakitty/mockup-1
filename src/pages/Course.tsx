
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseLearningMap } from "@/components/course/CourseLearningMap";
import { CourseLearningJourney } from "@/components/course/CourseLearningJourney";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
}

// This would typically come from an API
const coursesData = [
  {
    id: 1,
    title: "Foundations of Cryptography",
    description: "Learn the basic paradigm and principles of modern cryptography",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Network Science for Web",
    description: "Network science is a multidisciplinary field",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms and applications",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript for modern web development",
    image: "/placeholder.svg",
  },
];

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const [selectedView, setSelectedView] = useState("Regions");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  
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
    // Find the course that matches the ID
    const foundCourse = coursesData.find(course => course.id === Number(id));
    if (foundCourse) {
      setCourseData(foundCourse);
      document.title = `Course: ${foundCourse.title}`;
    } else {
      console.error(`Course with ID ${id} not found`);
    }

    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(prev => ({ ...prev, ...JSON.parse(storedProfile) }));
    }
  }, [id]);

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  if (!courseData) {
    return <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary">Loading course...</h2>
        <p className="text-gray-500">Please wait while we load your course data.</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <CourseHeader 
        course={courseData}
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
          <CourseLearningJourney courseId={Number(id)} />
        </div>
      </main>
    </div>
  );
}
