
import { useState, useEffect } from "react";
import { UserProfile } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProfileManager(initialProfile: UserProfile, onSave: (profile: UserProfile) => void) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch user data from Supabase on mount
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('full_name, email, role, bio')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (userProfile) {
        // Split full name into first and last name if available
        let firstName = "", lastName = "";
        if (userProfile.full_name) {
          const nameParts = userProfile.full_name.split(' ');
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(' ') || "";
        }

        const updatedProfile = {
          firstName,
          lastName,
          fullName: userProfile.full_name || "",
          email: userProfile.email || "",
          userRoles: [userProfile.role],
          bio: userProfile.bio || "",
        };
        
        setProfile(updatedProfile);
        onSave(updatedProfile);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => {
      // Update fullName automatically when firstName or lastName changes
      if (field === "firstName" || field === "lastName") {
        const updatedFirstName = field === "firstName" ? value : prev.firstName || "";
        const updatedLastName = field === "lastName" ? value : prev.lastName || "";
        
        return {
          ...prev,
          [field]: value,
          fullName: `${updatedFirstName} ${updatedLastName}`.trim()
        };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Avatar upload error:", error);
      return null;
    }
  };

  const saveProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const userId = session.user.id;
      let avatarUrl = profile.avatarUrl;
      
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(userId);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: profile.fullName,
          bio: profile.bio,
          avatar_url: avatarUrl
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
      
      const updatedProfile = {
        ...profile,
        avatarUrl
      };
      
      // Save to localStorage for persistence
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      
      // Call the parent's onSave
      onSave(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    avatarFile,
    fetchUserProfile,
    handleChange,
    handleAvatarChange,
    saveProfile
  };
}
