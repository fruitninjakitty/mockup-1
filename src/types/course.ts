
export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  roles?: string[];
  schoolCode?: string;
  createdAt?: string;
  skillLevel?: string;
  duration?: string;
  totalStudents?: number;
  certification?: boolean;
  learningObjectives?: string[];
  prerequisites?: string[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  learningGoal?: string;
  focusArea?: string;
  learningSchedule?: string;
  bio?: string;
  avatarUrl?: string;
}
