
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useFetchProfile(initialProfile: UserProfile) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      try {
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('full_name, email, role, bio, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return false;
        }

        if (userProfile) {
          // Split full name into first and last name if available
          let firstName = "", lastName = "";
          if (userProfile.full_name) {
            const nameParts = userProfile.full_name.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(' ') || "";
          }

          // Ensure there's always a default role
          const role = userProfile.role || "learner";
          
          const updatedProfile = {
            firstName,
            lastName,
            fullName: userProfile.full_name || "",
            email: userProfile.email || "",
            userRoles: [role.charAt(0).toUpperCase() + role.slice(1)], // Capitalize role
            bio: userProfile.bio || "",
            avatarUrl: userProfile.avatar_url || undefined
          };
          
          setProfile(updatedProfile);
          return updatedProfile;
        }
      } catch (profileError) {
        console.error("Error in profile fetch:", profileError);
        return false;
      }
      
      return false;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    setProfile,
    isLoading,
    fetchUserProfile
  };
}
