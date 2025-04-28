
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";
import { CourseCard } from "@/components/courses/CourseCard";
import { CoursesHeader } from "@/components/courses/CoursesHeader";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
}

const initialCourses = [
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
  const { toast } = useToast();
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

  // Track active and archived courses
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [archivedCourses, setArchivedCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Initialize courses from localStorage or use defaults
    const storedActiveCourses = localStorage.getItem('activeCourses');
    const storedArchivedCourses = localStorage.getItem('archivedCourses');
    
    if (storedActiveCourses) {
      setActiveCourses(JSON.parse(storedActiveCourses));
    } else {
      setActiveCourses(initialCourses);
    }
    
    if (storedArchivedCourses) {
      setArchivedCourses(JSON.parse(storedArchivedCourses));
    } else {
      setArchivedCourses([]);
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('activeCourses', JSON.stringify(activeCourses));
    localStorage.setItem('archivedCourses', JSON.stringify(archivedCourses));
  }, [activeCourses, archivedCourses]);

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

  // Handle archive/unarchive functionality
  const handleArchiveToggle = (courseId: number, archive: boolean) => {
    if (archive) {
      // Move course from active to archived
      const courseToArchive = activeCourses.find(course => course.id === courseId);
      if (courseToArchive) {
        setActiveCourses(activeCourses.filter(course => course.id !== courseId));
        setArchivedCourses([...archivedCourses, courseToArchive]);
        toast({
          title: "Course Archived",
          description: `${courseToArchive.title} has been archived.`,
          duration: 3000,
        });
      }
    } else {
      // Move course from archived to active
      const courseToUnarchive = archivedCourses.find(course => course.id === courseId);
      if (courseToUnarchive) {
        setArchivedCourses(archivedCourses.filter(course => course.id !== courseId));
        setActiveCourses([...activeCourses, courseToUnarchive]);
        toast({
          title: "Course Unarchived",
          description: `${courseToUnarchive.title} has been moved back to active courses.`,
          duration: 3000,
        });
      }
    }
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
                {activeCourses.length > 0 ? (
                  activeCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onArchiveToggle={handleArchiveToggle}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No active courses found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedCourses.length > 0 ? (
                  archivedCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isArchived={true}
                      onArchiveToggle={handleArchiveToggle} 
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No archived courses found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recommended Courses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCourses.slice(0, 2).map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onArchiveToggle={handleArchiveToggle}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
