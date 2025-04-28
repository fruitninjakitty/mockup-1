
export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  roles?: string[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  learningGoal: string;
  focusArea: string;
  learningSchedule: string;
  bio: string;
}
