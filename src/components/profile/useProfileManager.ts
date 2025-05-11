
import { useState } from "react";
import { UserProfile } from "./types";
import { useFetchProfile } from "./hooks/useFetchProfile";
import { useSaveProfile } from "./hooks/useSaveProfile";

export function useProfileManager(initialProfile: UserProfile, onSave: (profile: UserProfile) => void) {
  const { profile, setProfile, isLoading, fetchUserProfile } = useFetchProfile(initialProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { isSaving, saveProfile } = useSaveProfile();

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

  const handleSaveProfile = async () => {
    const updatedProfile = await saveProfile(profile, avatarFile);
    
    if (updatedProfile) {
      onSave(updatedProfile);
      return true;
    }
    
    return false;
  };

  return {
    profile,
    isLoading: isLoading || isSaving,
    avatarFile,
    fetchUserProfile,
    handleChange,
    handleAvatarChange,
    saveProfile: handleSaveProfile
  };
}
