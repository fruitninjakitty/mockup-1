
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "../types";
import { uploadAvatar } from "../utils/avatarUtils";

export function useSaveProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveProfile = async (profile: UserProfile, avatarFile: File | null) => {
    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      
      const userId = session.user.id;
      let avatarUrl = profile.avatarUrl;
      
      // Upload new avatar if provided
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(userId, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Check if the profile exists
      try {
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();
        
        if (checkError || !existingProfile) {
          // Profile doesn't exist, insert it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ 
              id: userId,
              full_name: profile.fullName,
              email: profile.email,
              bio: profile.bio,
              avatar_url: avatarUrl,
              role: 'learner' // Default role
            });
          
          if (insertError) {
            throw insertError;
          }
        } else {
          // Profile exists, update it
          const { error } = await supabase
            .from('profiles')
            .update({ 
              full_name: profile.fullName,
              bio: profile.bio,
              avatar_url: avatarUrl,
            })
            .eq('id', userId);

          if (error) {
            throw error;
          }
        }
      } catch (error) {
        console.error("Error checking/updating profile:", error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      const updatedProfile = {
        ...profile,
        avatarUrl
      };
      
      // Save to localStorage for persistence
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });
      
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveProfile
  };
}
