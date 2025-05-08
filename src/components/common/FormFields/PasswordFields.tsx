
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, KeyRound } from "lucide-react";

export interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  confirmLabel?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPlaceholder?: string;
}

export function PasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordLabel = "Password",
  confirmLabel = "Re-enter Password",
  passwordPlaceholder = "Password",
  confirmPlaceholder = "Re-enter Password"
}: PasswordFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="register-password" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Lock size={16} className="text-[#43BC88]" /> {passwordLabel}
        </Label>
        <Input
          id="register-password"
          type="password"
          placeholder={passwordPlaceholder}
          className="w-full border-border"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-confirm" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <KeyRound size={16} className="text-[#43BC88]" /> {confirmLabel}
        </Label>
        <Input
          id="register-confirm"
          type="password"
          placeholder={confirmPlaceholder}
          className="w-full border-border"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
