
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { useToast } from "@/hooks/use-toast";
import { dbRoleToDisplayRole } from "@/utils/roleUtils";

export function useFetchProfile(initialProfile: UserProfile) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log("No active session found");
        return false;
      }

      console.log("Fetching profile for user:", session.user.id);

      try {
        // Get profile information from the profiles table
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('full_name, email, role, bio, avatar_url, organization_id')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile information",
            variant: "destructive",
          });
          return false;
        }

        if (userProfile) {
          console.log("Retrieved profile data:", userProfile);
          
          // Split full name into first and last name if available
          let firstName = "", lastName = "";
          if (userProfile.full_name) {
            const nameParts = userProfile.full_name.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(' ') || "";
          }

          // Get all user roles
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);
            
          if (rolesError) {
            console.error("Error fetching user roles:", rolesError);
          }
          
          // Convert database roles to display roles and ensure at least the primary role is included
          const roles = userRoles && userRoles.length > 0
            ? userRoles.map(r => dbRoleToDisplayRole(r.role))
            : [dbRoleToDisplayRole(userProfile.role)];
          
          // If organization_id is present, fetch school code
          let schoolCode = "";
          if (userProfile.organization_id) {
            const { data: org, error: orgError } = await supabase
              .from('organizations')
              .select('code')
              .eq('id', userProfile.organization_id)
              .single();
              
            if (!orgError && org) {
              schoolCode = org.code;
            } else {
              console.error("Error fetching organization code:", orgError);
            }
          }

          // Ensure there's always a default role
          const role = userProfile.role || "learner";
          
          const updatedProfile: UserProfile = {
            firstName,
            lastName,
            fullName: userProfile.full_name || "",
            email: userProfile.email || "",
            userRoles: roles,
            bio: userProfile.bio || "",
            avatarUrl: userProfile.avatar_url || undefined,
            schoolCode
          };
          
          console.log("Setting profile data:", updatedProfile);
          setProfile(updatedProfile);
          return updatedProfile;
        } else {
          console.log("No profile data found");
        }
      } catch (profileError) {
        console.error("Error in profile fetch:", profileError);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
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
