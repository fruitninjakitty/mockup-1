
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  userRoles?: string[];
  schoolCode?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ProfileFormProps {
  profile: UserProfile;
  isLoading: boolean;
  avatarFile: File | null;
  onProfileChange: (field: keyof UserProfile, value: string) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
