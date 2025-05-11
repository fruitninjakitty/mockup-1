import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatabaseRole } from "@/types/roles";
import { UserProfile } from "@/components/profile/ProfileDashboard";

export function useProfileData() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    bio: "",
    userRoles: ["Learner"] // Default role
  });
  
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
    
    fetchUserProfile();
  }, [toast]);

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

  return {
    userProfile,
    setUserProfile,
    isProfileOpen,
    setIsProfileOpen
  };
}
