
import { LearningNodeListProps } from "@/types/course-types";
import { LearningNodeItem } from "./LearningNodeItem";

export function LearningNodeList({ nodes }: LearningNodeListProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-6">
        {nodes.map((node, index) => (
          <LearningNodeItem 
            key={node.id} 
            node={node} 
            isLast={index === nodes.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

