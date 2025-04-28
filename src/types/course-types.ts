
import { UserProfile } from "./course";

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface CourseViewState {
  selectedView: string;
  onViewChange: (view: string) => void;
}

export interface CoursePlaceholderProps {
  message: string;
  description?: string;
}
