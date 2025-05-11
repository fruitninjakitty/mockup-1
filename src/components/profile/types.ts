
/**
 * Represents a user's profile information
 */
export interface UserProfile {
  /** User's first name (optional) */
  firstName?: string;
  /** User's last name (optional) */
  lastName?: string;
  /** User's full name (required) */
  fullName: string;
  /** User's email address (required) */
  email: string;
  /** List of roles assigned to the user (optional) */
  userRoles?: string[];
  /** School or organization code (optional) */
  schoolCode?: string;
  /** User's biography or description (optional) */
  bio?: string;
  /** URL to user's avatar image (optional) */
  avatarUrl?: string;
}

/**
 * Props for the ProfileForm component
 */
export interface ProfileFormProps {
  /** The user profile data to display and edit */
  profile: UserProfile;
  /** Whether the profile is currently being loaded or saved */
  isLoading: boolean;
  /** File object for a new avatar that has been selected but not yet uploaded */
  avatarFile: File | null;
  /** Handler for when profile fields are changed */
  onProfileChange: (field: keyof UserProfile, value: string) => void;
  /** Handler for when a new avatar image is selected */
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Valid user role types
 */
export type UserRole = 'Learner' | 'Teacher' | 'Teaching Assistant' | 'Administrator';
