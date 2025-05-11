import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatabaseRole } from "@/types/roles";

// Define the database role type for better type safety
type DatabaseRole = Database["public"]["Enums"]["user_role"];

export default function Courses() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [courseView, setCourseView] = useState("active");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    bio: "",
    userRoles: ["Learner"] // Default role
  });
  
  const { activeCourses, archivedCourses, handleArchiveToggle } = useCourseManagement();
  const { roles, availableRoles, currentQuote, handleRoleChange } = useRoleManagement();
  const { toast } = useToast();
  
  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, email, role, bio, avatar_url')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          // If there's an error, keep the default profile but try to update the database
          await createDefaultProfile(session.user.id);
          return;
        }
        
        if (profile) {
          // Ensure there's always a default role
          const role = profile.role || "learner";
          
          setUserProfile({
            fullName: profile.full_name || "",
            email: profile.email || "",
            userRoles: [role.charAt(0).toUpperCase() + role.slice(1)], // Capitalize the role
            bio: profile.bio || "",
            avatarUrl: profile.avatar_url || undefined
          });
          
          // If no role is set, update it to the default
          if (!profile.role) {
            updateDefaultRole(session.user.id);
          }
        } else {
          // If no profile is found, create one
          await createDefaultProfile(session.user.id);
        }
      } catch (error) {
        console.error("Exception fetching profile:", error);
        // Even if there's an error, try to create a default profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await createDefaultProfile(user.id);
        }
      }
    };
    
    // Helper function to update default role
    const updateDefaultRole = async (userId: string) => {
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'learner' as DatabaseRole })
          .eq('id', userId);
          
        if (updateError) {
          console.error("Error setting default role:", updateError);
        }
      } catch (error) {
        console.error("Exception setting default role:", error);
      }
    };
    
    // Helper function to create a default profile
    const createDefaultProfile = async (userId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const defaultProfile = {
          id: userId,
          full_name: user.user_metadata?.full_name || "New User",
          email: user.email || "",
          role: 'learner' as DatabaseRole,
          bio: "",
          avatar_url: null,
          is_approved: false
        };
        
        const { error } = await supabase
          .from('profiles')
          .upsert(defaultProfile)
          .select();
          
        if (error) {
          console.error("Error creating default profile:", error);
          return;
        }
        
        // Update local state with the default profile
        setUserProfile({
          fullName: defaultProfile.full_name,
          email: defaultProfile.email,
          userRoles: ["Learner"],
          bio: defaultProfile.bio,
          avatarUrl: defaultProfile.avatar_url || undefined
        });
      } catch (error) {
        console.error("Exception creating default profile:", error);
      }
    };
    
    fetchUserProfile();
  }, [toast]);

  // Filter courses based on user roles
  const filteredActiveCourses = activeCourses.filter(course => 
    !course.roles || roles.some(role => course.roles?.includes(role))
  );

  const filteredArchivedCourses = archivedCourses.filter(course => 
    !course.roles || roles.some(role => course.roles?.includes(role))
  );

  const showCreateCourse = roles.includes("Teacher") || roles.includes("Administrator");
  const showRecommendedCourses = roles.includes("Learner");
  const showUserSearch = roles.includes("Teacher") || roles.includes("Administrator");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
      <CoursesHeader
        roles={roles.length > 0 ? roles : ["Learner"]} // Ensure default
        availableRoles={availableRoles}
        quote={currentQuote}
        onRoleChange={handleRoleChange}
        onProfileClick={() => setIsProfileOpen(true)}
        userInitial={userProfile.fullName ? userProfile.fullName.charAt(0) : ""}
        avatarUrl={userProfile.avatarUrl}
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
