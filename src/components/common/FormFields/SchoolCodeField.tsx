
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

interface SchoolCodeFieldProps {
  schoolCode: string;
  onSchoolCodeChange: (value: string) => void;
  disabled?: boolean;
}

export function SchoolCodeField({ schoolCode, onSchoolCodeChange, disabled = false }: SchoolCodeFieldProps) {
  // Check if we have a stored school code
  useEffect(() => {
    const storedCode = localStorage.getItem('schoolCode');
    if (storedCode && !schoolCode) {
      onSchoolCodeChange(storedCode);
      // Clear after using it once
      localStorage.removeItem('schoolCode');
    }
  }, [schoolCode, onSchoolCodeChange]);

  return (
    <div className="space-y-1">
      <Label htmlFor="school-code" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
        <KeyRound size={16} className="text-[#43BC88]" /> School/Organization Code
      </Label>
      <Input
        id="school-code"
        type="text"
        placeholder="Enter your school or organization code"
        value={schoolCode}
        onChange={(e) => onSchoolCodeChange(e.target.value)}
        disabled={disabled}
        className="border-border w-full"
        required
      />
    </div>
  );
}
