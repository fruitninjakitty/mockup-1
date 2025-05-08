
import { Building, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfoFields, PasswordFields } from "@/components/common/FormFields";

export interface AdminRegisterFormFieldsProps {
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

      <PersonalInfoFields
        firstName={firstName}
        lastName={lastName}
        email={email}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onEmailChange={onEmailChange}
        emailLabel="Email Address"
        emailPlaceholder="Enter your email"
      />

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

      <PasswordFields
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={onPasswordChange}
        onConfirmPasswordChange={onConfirmPasswordChange}
        passwordLabel="Password"
        confirmLabel="Confirm Password"
        passwordPlaceholder="Create password"
        confirmPlaceholder="Confirm password"
      />
    </>
  );
}
