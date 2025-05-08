
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User } from "lucide-react";

export interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  emailPlaceholder?: string;
}

export function PersonalInfoFields({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  firstNameLabel = "First Name",
  lastNameLabel = "Last Name",
  emailLabel = "Email ID",
  firstNamePlaceholder = "First Name",
  lastNamePlaceholder = "Last Name",
  emailPlaceholder = "Email ID"
}: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="register-firstname" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <User size={16} className="text-[#43BC88]" /> {firstNameLabel}
          </Label>
          <Input
            id="register-firstname"
            type="text"
            placeholder={firstNamePlaceholder}
            className="w-full border-border"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="register-lastname" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <User size={16} className="text-[#43BC88]" /> {lastNameLabel}
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder={lastNamePlaceholder}
            className="w-full border-border"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Mail size={16} className="text-[#43BC88]" /> {emailLabel}
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder={emailPlaceholder}
          className="w-full border-border"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}
