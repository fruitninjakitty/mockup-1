
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

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
          Note: If the verification link doesn't work, make sure your Supabase project has the correct Site URL and redirect URLs configured.
        </p>
        <div className="mt-4 pt-4 border-t border-amber-200">
          <p className="text-xs text-gray-500 mb-2 font-medium">Troubleshooting tips:</p>
          <ul className="text-xs text-left text-gray-500 space-y-1">
            <li>• Check your spam folder if you don't see the email</li>
            <li>• Make sure your Supabase URL Configuration has the correct settings</li>
            <li>• Site URL should be set to your application URL</li>
            <li>• Redirect URLs should include your application URL</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Button
          onClick={onReload}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md"
        >
          I've Verified My Email
        </Button>
        <a 
          href="https://supabase.com/dashboard/project/jbgvcgrkfxlihcvqssah/auth/url-configuration"
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-700 flex items-center justify-center gap-1"
        >
          Check Supabase URL Configuration <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
