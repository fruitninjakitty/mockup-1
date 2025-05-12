
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileFormProps } from "./types";
import { ProfileInfoFields } from "./components/ProfileInfoFields";

export function ProfileForm({ profile, isLoading, avatarFile, onProfileChange, onAvatarChange }: ProfileFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* Avatar Upload */}
      <ProfileAvatar 
        avatarUrl={profile.avatarUrl} 
        fullName={profile.fullName}
        onAvatarChange={onAvatarChange}
        isLoading={isLoading}
      />
      
      {/* Profile Information Fields */}
      <ProfileInfoFields
        profile={profile}
        isLoading={isLoading}
        onProfileChange={onProfileChange}
      />
    </div>
  );
}
