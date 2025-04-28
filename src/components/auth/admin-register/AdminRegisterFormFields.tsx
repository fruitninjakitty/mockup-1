
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Mail, User, Lock, KeyRound, Briefcase } from "lucide-react";

interface AdminRegisterFormFieldsProps {
  organizationName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  onOrganizationNameChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export function AdminRegisterFormFields({
  organizationName,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  onOrganizationNameChange,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: AdminRegisterFormFieldsProps) {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="org-name" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Building size={16} className="text-[#43BC88]" /> Organization Name
        </Label>
        <Input
          id="org-name"
          type="text"
          placeholder="Enter your institution name"
          value={organizationName}
          onChange={(e) => onOrganizationNameChange(e.target.value)}
          className="w-full border-border"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="admin-firstname" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <User size={16} className="text-[#43BC88]" /> First Name
          </Label>
          <Input
            id="admin-firstname"
            type="text"
            placeholder="First Name"
            className="w-full border-border"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin-lastname" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <User size={16} className="text-[#43BC88]" /> Last Name
          </Label>
          <Input
            id="admin-lastname"
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
        <Label htmlFor="admin-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Mail size={16} className="text-[#43BC88]" /> Email Address
        </Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="Enter your email"
          className="w-full border-border"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="admin-role" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Briefcase size={16} className="text-[#43BC88]" /> Role
        </Label>
        <Input
          id="admin-role"
          type="text"
          value="Administrator"
          className="w-full border-border bg-gray-100"
          readOnly
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="admin-password" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <Lock size={16} className="text-[#43BC88]" /> Password
          </Label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Create password"
            className="w-full border-border"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin-confirm" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <KeyRound size={16} className="text-[#43BC88]" /> Confirm Password
          </Label>
          <Input
            id="admin-confirm"
            type="password"
            placeholder="Confirm password"
            className="w-full border-border"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
}
