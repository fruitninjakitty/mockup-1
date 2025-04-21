import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Archive, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";

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
  const navigate = useNavigate();
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

  const getRandomQuote = (roleType) => {
    const quotes = roleBasedQuotes[roleType] || roleBasedQuotes["Learner"];
    const randomIndex = Math.floor(Math.random() % quotes.length);
    return quotes[randomIndex];
  };

  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(role));

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setCurrentQuote(getRandomQuote(newRole));
  };

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
      <header className="header-glass sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center">
                Hello, <Select value={role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="inline-flex w-auto text-2xl font-bold text-primary border-none bg-transparent p-0 focus:ring-0 ml-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-40 shadow-lg border border-border rounded-lg">
                    <SelectItem value="Learner">Learner</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Teaching Assistant">Teaching Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </h1>
              <p className="text-sm text-gray-500">{currentQuote}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full transition-all hover:bg-primary/20"
            onClick={() => setIsProfileOpen(true)}
            title="Your Profile"
          >
            <span className="sr-only">User menu</span>
            <div className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center font-semibold border-2 border-white shadow-inner">
              {userProfile.fullName ? userProfile.fullName.charAt(0) : "J"}
            </div>
          </Button>
        </div>
      </header>

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
                  <Card key={course.id} className="minimal-card card-gradient transition-transform hover:scale-105">
                    <CardHeader>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-44 object-cover rounded-xl mb-2"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                      <div className="flex justify-between mt-3">
                        <Button
                          className="w-5/6 bg-secondary text-white font-semibold shadow hover:bg-secondary/90"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          Continue Learning
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Archive Course"
                          className="border-gray-200"
                        >
                          <Archive className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedCourses.map((course) => (
                  <Card key={course.id} className="minimal-card bg-muted card-gradient opacity-80 transition-transform hover:scale-102">
                    <CardHeader>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-44 object-cover rounded-xl mb-2 opacity-80"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg text-gray-600">{course.title}</CardTitle>
                      <CardDescription className="text-gray-500">{course.description}</CardDescription>
                      <div className="flex justify-between mt-3">
                        <Button
                          variant="outline"
                          className="w-5/6"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          View Course
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Unarchive Course"
                          className="border-gray-200"
                        >
                          <Archive className="h-4 w-4 text-secondary" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
              <Card key={course.id} className="minimal-card card-gradient transition-transform hover:scale-105">
                <CardHeader>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-44 object-cover rounded-xl mb-2"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
