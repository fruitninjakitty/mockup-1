
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProfileData() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    learningGoal: "",
    focusArea: "",
    learningSchedule: "",
    bio: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        // First check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If not authenticated, try to get from localStorage
          loadFromLocalStorage();
          return;
        }

        // Fetch user profile from Supabase
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
          loadFromLocalStorage();
          return;
        }

        if (profileData) {
          // Transform data to match our UserProfile type
          const profile: UserProfile = {
            fullName: profileData.full_name || "",
            email: profileData.email || "",
            bio: profileData.bio || "",
            // If we have additional data in profiles table for these fields,
            // we would map them here. For now, check localStorage for additional fields.
            learningGoal: "",
            focusArea: "",
            learningSchedule: "",
            avatarUrl: profileData.avatar_url,
          };

          // Try to merge with localStorage data for fields not in database
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            try {
              const parsedProfile = JSON.parse(storedProfile);
              profile.learningGoal = parsedProfile.learningGoal || "";
              profile.focusArea = parsedProfile.focusArea || "";
              profile.learningSchedule = parsedProfile.learningSchedule || "";
            } catch (parseError) {
              console.error("Error parsing stored profile:", parseError);
            }
          }

          setUserProfile(profile);
          
          // Save merged profile back to localStorage
          localStorage.setItem("userProfile", JSON.stringify(profile));
        } else {
          // If no profile in database, fallback to localStorage
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setUserProfile(parsedProfile);
        } catch (error) {
          console.error("Error parsing stored profile:", error);
          toast({
            title: "Error",
            description: "Could not load your profile data",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    };

    fetchProfileData();
  }, [toast]);

  const saveProfile = async (updatedProfile: UserProfile) => {
    try {
      // Save to state
      setUserProfile(updatedProfile);
      
      // Save to localStorage as backup
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      // If authenticated, also save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: updatedProfile.fullName,
            bio: updatedProfile.bio,
            // Only update email if it has changed and authentication allows it
            ...(updatedProfile.email !== user.email ? { email: updatedProfile.email } : {})
          })
          .eq("id", user.id);

        if (error) {
          console.error("Error updating profile in Supabase:", error);
          toast({
            title: "Warning",
            description: "Profile saved locally but could not be updated in database.",
            variant: "default",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: "Could not save your profile",
        variant: "destructive",
      });
    }
  };

  return { 
    userProfile, 
    setUserProfile: saveProfile, 
    isProfileOpen, 
    setIsProfileOpen,
    isLoading 
  };
}
