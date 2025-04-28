
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminRegisterFormFields } from "./AdminRegisterFormFields";
import { EmailVerificationRequired } from "./EmailVerificationRequired";
import { OrganizationCodeDisplay } from "./OrganizationCodeDisplay";

export function AdminRegisterForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationCode, setOrganizationCode] = useState("");
  const [showOrganizationCode, setShowOrganizationCode] = useState(false);
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);
  const [formError, setFormError] = useState("");

  const generateOrganizationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const generatedCode = generateOrganizationCode();
    setOrganizationCode(generatedCode);

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes("Email signups are disabled")) {
          setFormError("Email signups are currently disabled. Please contact the administrator to enable email signups.");
        } else {
          setFormError(authError.message);
        }
        toast({
          title: "Registration failed",
          description: authError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Registration error",
          description: "Failed to create user account",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (authData.session === null) {
        setEmailConfirmRequired(true);
        toast({
          title: "Email verification required",
          description: "Please check your email to verify your account before continuing",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        if (signInError.message.includes("Email not confirmed")) {
          setEmailConfirmRequired(true);
          toast({
            title: "Email verification required",
            description: "Please check your email to verify your account before continuing",
            duration: 5000,
          });
          setIsLoading(false);
          return;
        }
        
        toast({
          title: "Sign in failed",
          description: signInError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!signInData.session) {
        setEmailConfirmRequired(true);
        toast({
          title: "Email verification required",
          description: "Please check your email to verify your account before continuing",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          code: generatedCode,
          created_by: authData.user.id
        })
        .select()
        .single();

      if (orgError) {
        console.error("Organization creation error:", orgError);
        toast({
          title: "Failed to create organization",
          description: orgError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          organization_id: orgData.id,
          role: 'administrator'
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast({
          title: "Failed to update profile",
          description: profileError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setShowOrganizationCode(true);
      toast({
        title: "Registration successful!",
        description: "Your administrator account has been created",
        duration: 3000,
      });

    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailConfirmRequired) {
    return <EmailVerificationRequired email={email} onReload={() => window.location.reload()} />;
  }

  if (showOrganizationCode) {
    return <OrganizationCodeDisplay organizationCode={organizationCode} />;
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
          <p className="font-medium">Registration Error:</p>
          <p>{formError}</p>
          <p className="text-xs mt-2">
            If email signups are disabled, please check your Supabase authentication settings.
          </p>
        </div>
      )}
      
      <AdminRegisterFormFields
        organizationName={organizationName}
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        onOrganizationNameChange={setOrganizationName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
      />

      <Button
        type="submit"
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold mt-4 rounded-md flex items-center justify-center gap-2"
        disabled={isLoading}
        aria-label="Register as Administrator"
      >
        {isLoading ? "Creating Account..." : (
          <>
            <UserPlus size={18} />
            <span>Register as Administrator</span>
          </>
        )}
      </Button>
    </form>
  );
}
