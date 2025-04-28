
import { CoursePlaceholderProps } from "@/types/course-types";

export function CoursePlaceholder({ message, description }: CoursePlaceholderProps) {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary">{message}</h2>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  );
}
