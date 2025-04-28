
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, KeyRound } from "lucide-react";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export function PasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}: PasswordFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="register-password" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Lock size={16} className="text-[#43BC88]" /> Password
        </Label>
        <Input
          id="register-password"
          type="password"
          placeholder="Password"
          className="w-full border-border"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-confirm" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <KeyRound size={16} className="text-[#43BC88]" /> Re-enter Password
        </Label>
        <Input
          id="register-confirm"
          type="password"
          placeholder="Re-enter Password"
          className="w-full border-border"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
