
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LearningNodeActionsProps } from "@/types/course-types";

export function LearningNodeActions({ node }: LearningNodeActionsProps) {
  if (!node.completed) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#43BC88] h-7 px-2">
          <BookOpen className="h-3.5 w-3.5 mr-1" />
          View
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{node.title}</h4>
          <p className="text-sm text-gray-600">
            You completed this topic on {node.date}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <BookOpen className="h-3 w-3" />
            <span>Resource: Lecture Notes</span>
          </div>
          <Button size="sm" className="w-full mt-2 bg-[#43BC88]">
            View Resource
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

