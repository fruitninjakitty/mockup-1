
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";
import { CoursesHeader } from "@/components/courses/CoursesHeader";
import { CourseList } from "@/components/courses/CourseList";
import { UserSearch } from "@/components/search/UserSearch";
import { CreateCourseDialog } from "@/components/courses/CreateCourseDialog";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";

export default function Courses() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [courseView, setCourseView] = useState("active");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    learningGoal: "professional",
    focusArea: "skills", 
    learningSchedule: "morning",
    bio: ""
  });

  const { activeCourses, archivedCourses, handleArchiveToggle } = useCourseManagement();
  const { role, currentQuote, handleRoleChange } = useRoleManagement();

  const filteredActiveCourses = activeCourses.filter(course => 
    course.roles ? course.roles.includes(role) : true
  );

  const filteredArchivedCourses = archivedCourses.filter(course => 
    course.roles ? course.roles.includes(role) : true
  );

  const showCreateCourse = role === "Teacher" || role === "Administrator";
  const showRecommendedCourses = role === "Learner";
  const showUserSearch = role === "Teacher" || role === "Administrator";

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
        onSave={setUserProfile}
      />

      <main className="container section-padding">
        {showUserSearch && (
          <section className="mb-8">
            <UserSearch />
          </section>
        )}

        <section className="mb-12 fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Your Courses</h2>
            {showCreateCourse && <CreateCourseDialog />}
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
              <CourseList 
                courses={filteredActiveCourses}
                onArchiveToggle={handleArchiveToggle}
              />
            </TabsContent>
            
            <TabsContent value="archived">
              <CourseList 
                courses={filteredArchivedCourses}
                isArchived={true}
                onArchiveToggle={handleArchiveToggle}
              />
            </TabsContent>
          </Tabs>
        </section>

        {showRecommendedCourses && (
          <section className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Recommended Courses</h2>
            </div>
            <CourseList 
              courses={activeCourses}
              onArchiveToggle={handleArchiveToggle}
            />
          </section>
        )}
      </main>
    </div>
  );
}
