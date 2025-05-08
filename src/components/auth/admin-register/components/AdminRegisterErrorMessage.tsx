
import { AlertCircle } from "lucide-react";

interface AdminRegisterErrorMessageProps {
  formError: string;
}

export function AdminRegisterErrorMessage({ formError }: AdminRegisterErrorMessageProps) {
  if (!formError) return null;
  
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
      <div className="flex items-center gap-2 mb-1">
        <AlertCircle className="h-4 w-4" />
        <p className="font-medium">Registration Error:</p>
      </div>
      <p>{formError}</p>
      {formError.includes("Permission configuration") && (
        <p className="text-xs mt-2">
          Our system administrators have been notified of this issue.
        </p>
      )}
      {formError.includes("Email signups are disabled") && (
        <p className="text-xs mt-2">
          If email signups are disabled, please check your Supabase authentication settings.
        </p>
      )}
    </div>
  );
}
