
import { CheckCircle, Lock } from "lucide-react";
import { LearningNodeItemProps } from "@/types/course-types";
import { LearningNodeActions } from "./LearningNodeActions";

export function LearningNodeItem({ node, isLast }: LearningNodeItemProps) {
  return (
    <div className="relative pl-12">
      <div 
        className={`absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center z-10 
          ${node.locked 
            ? "bg-gray-100 border border-gray-300" 
            : node.completed 
              ? "bg-[#43BC88] text-white" 
              : "bg-white border-2 border-secondary"}`}
      >
        {node.locked ? (
          <Lock className="h-3 w-3 text-gray-400" />
        ) : node.completed ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
        )}
      </div>
      
      <div className={`p-3 rounded-lg ${node.locked ? "bg-gray-50" : "bg-white border shadow-sm"}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium ${node.locked ? "text-gray-400" : ""}`}>{node.title}</h3>
            {node.date && <time className="text-xs text-gray-500">{node.date}</time>}
          </div>
          <LearningNodeActions node={node} />
        </div>
      </div>
      
      {!isLast && (
        <div className="absolute left-4 top-7 bottom-0 w-0.5 bg-gray-200 z-0"></div>
      )}
    </div>
  );
}

