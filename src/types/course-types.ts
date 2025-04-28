
import { UserProfile } from "./course";

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  schoolCode?: string;
  createdAt?: string;
  createdBy?: {
    fullName: string;
    email: string;
  };
  totalStudents?: number;
  learningNodes?: LearningNode[];
  learningObjectives?: string[];
  prerequisites?: string[];
  skillLevel?: string;
  duration?: string;
  certification?: boolean;
  organizationId?: string; // Added to store the organization ID
}

export interface CourseViewState {
  selectedView: string;
  onViewChange: (view: string) => void;
}

export interface CoursePlaceholderProps {
  message: string;
  description?: string;
}

export interface LearningNode {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
  locked?: boolean;
}

export interface LearningNodeItemProps {
  node: LearningNode;
  isLast: boolean;
}

export interface LearningNodeActionsProps {
  node: LearningNode;
}

export interface LearningNodeListProps {
  nodes: LearningNode[];
}
