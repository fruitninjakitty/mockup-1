
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UserTypeFieldsProps {
  userType: "student" | "teacher" | "assistant";
  onUserTypeChange: (value: "student" | "teacher" | "assistant") => void;
}

export function UserTypeFields({ userType, onUserTypeChange }: UserTypeFieldsProps) {
  return (
    <div className="space-y-1">
      <Label className="text-[#43BC88] text-sm font-semibold">
        Are you a:
      </Label>
      <RadioGroup
        value={userType}
        onValueChange={onUserTypeChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="text-[#43BC88]">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher" className="text-[#43BC88]">Teacher</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="assistant" id="assistant" />
          <Label htmlFor="assistant" className="text-[#43BC88]">Teaching Assistant</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
