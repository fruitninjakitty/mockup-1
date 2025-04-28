
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function PersonalInfoFields({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
}: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="register-firstname" className="text-[#43BC88] text-sm font-semibold">
            First Name
          </Label>
          <Input
            id="register-firstname"
            type="text"
            placeholder="First Name"
            className="w-full border-border"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="register-lastname" className="text-[#43BC88] text-sm font-semibold">
            Last Name
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder="Last Name"
            className="w-full border-border"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Mail size={16} className="text-[#43BC88]" /> Email ID
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="Email ID"
          className="w-full border-border"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}
