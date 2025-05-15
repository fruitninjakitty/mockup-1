
import { Button } from "@/components/ui/button";

interface EmailVerificationRequiredProps {
  email: string;
  onReload: () => void;
}

export function EmailVerificationRequired({ email, onReload }: EmailVerificationRequiredProps) {
  return (
    <div className="text-center space-y-6">
      <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-400">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Email Verification Required</h2>
        <p className="text-sm text-gray-600 mb-4">
          We've sent a verification link to <span className="font-medium">{email}</span>
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Please check your email inbox and click the verification link to complete your registration.
        </p>
        <p className="mt-6 text-xs text-gray-500">
          Note: If you don't see the verification email, check your spam folder or try reloading this page.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          For development purposes, you may want to disable email verification in the Supabase dashboard under Authentication → Settings.
        </p>
      </div>
      <Button
        onClick={onReload}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md"
      >
        I've Verified My Email
      </Button>
    </div>
  );
}
