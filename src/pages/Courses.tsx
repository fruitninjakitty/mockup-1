import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";
import { CourseCard } from "@/components/courses/CourseCard";
import { CoursesHeader } from "@/components/courses/CoursesHeader";

const activeCourses = [
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
];

const archivedCourses = [
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

const roleBasedQuotes = {
  Learner: [
    "Continue your learning journey, every step forward is progress.",
    "The best investment you can make is in your own education.",
    "Learning is a treasure that will follow its owner everywhere.",
  ],
  Teacher: [
    "Great teachers inspire minds and change lives forever.",
    "Teaching is the profession that teaches all other professions.",
    "The influence of a good teacher can never be erased.",
  ],
  "Teaching Assistant": [
    "Supporting others in their learning journey is a noble pursuit.",
    "Your guidance helps bridge the gap between teaching and understanding.",
    "Behind every successful student is a dedicated teaching team.",
  ],
};

export default function Courses() {
  const [courseView, setCourseView] = useState("active");
  const [role, setRole] = useState("Learner");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    learningGoal: "professional",
    focusArea: "skills", 
    learningSchedule: "morning",
    bio: ""
  });

  const getRandomQuote = (roleType: string) => {
    const quotes = roleBasedQuotes[roleType as keyof typeof roleBasedQuotes] || roleBasedQuotes["Learner"];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(role));

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setCurrentQuote(getRandomQuote(newRole));
  };

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
      <CoursesHeader
        role={role}
        quote={currentQuote}
        onRoleChange={handleRoleChange}
        onProfileClick={() => setIsProfileOpen(true)}
        userInitial={userProfile.fullName ? userProfile.fullName.charAt(0) : "J"}
      />

      <ProfileDashboard 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        initialProfile={userProfile}
        onSave={handleProfileSave}
      />

      <main className="container section-padding">
        <section className="mb-12 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Your Courses</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isArchived />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recommended Courses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
