
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SchoolCodeFieldProps {
  schoolCode: string;
  onSchoolCodeChange: (value: string) => void;
}

export function SchoolCodeField({ schoolCode, onSchoolCodeChange }: SchoolCodeFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor="register-school" className="text-[#43BC88] text-sm font-semibold">
        School Code
      </Label>
      <Input
        id="register-school"
        type="text"
        placeholder="School Code"
        className="w-full border-border"
        value={schoolCode}
        onChange={(e) => onSchoolCodeChange(e.target.value)}
        required
      />
    </div>
  );
}
