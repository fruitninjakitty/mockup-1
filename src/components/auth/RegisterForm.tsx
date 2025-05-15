
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  PersonalInfoFields, 
  PasswordFields, 
  SchoolCodeField 
} from "@/components/common/FormFields";
import { UserTypeFields } from "./FormFields/UserTypeFields";
import { DatabaseRole } from "@/types/roles";

export function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher" | "assistant">("student");
  const [schoolCode, setSchoolCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [formError, setFormError] = useState("");

  const validateSchoolCode = async (code: string) => {
    if (!code.trim()) return false;
    
    setIsCheckingCode(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('code', code)
        .single();
        
      if (error || !data) {
        console.error("School code validation error:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error validating school code:", error);
      return false;
    } finally {
      setIsCheckingCode(false);
    }
  };

  // Map user type to database role
  const mapUserTypeToDatabaseRole = (type: "student" | "teacher" | "assistant"): DatabaseRole => {
    switch (type) {
      case "teacher": return "teacher";
      case "assistant": return "teaching_assistant";
      case "student": 
      default: return "learner";
    }
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

    if (!schoolCode.trim()) {
      toast({
        title: "School code required",
        description: "Please enter your school/organization code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isValidCode = await validateSchoolCode(schoolCode);
      
      if (!isValidCode) {
        toast({
          title: "Invalid school code",
          description: "The school/organization code you entered does not exist",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('code', schoolCode)
        .single();

      if (orgError) {
        console.error("Organization lookup error:", orgError);
        toast({
          title: "Invalid school code",
          description: "The school/organization code you entered is not valid",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get the database role from the user type
      const role = mapUserTypeToDatabaseRole(userType);
      
      // Include the role in the user metadata during sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
            role: role // Add the role to user metadata
          }
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

      // Update profile with organization and role
      // We need to wait a moment to allow the auth trigger to create the profile
      setTimeout(async () => {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            organization_id: orgData.id,
            role: role
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          toast({
            title: "Failed to update profile",
            description: "Your account was created but profile details couldn't be saved. Please contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: `Registration successful. Welcome ${firstName}!`,
            duration: 1800,
          });

          navigate("/onboarding");
        }
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

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
      
      <PersonalInfoFields
        firstName={firstName}
        lastName={lastName}
        email={email}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onEmailChange={setEmail}
      />
      
      <UserTypeFields
        userType={userType}
        onUserTypeChange={(value) => setUserType(value)}
      />
      
      <SchoolCodeField
        schoolCode={schoolCode}
        onSchoolCodeChange={setSchoolCode}
      />
      
      <PasswordFields
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
      />
      
      <Button
        type="submit"
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold mt-2 rounded-md flex items-center justify-center gap-2"
        disabled={isLoading || isCheckingCode}
        aria-label="Create Account"
      >
        {isLoading ? "Creating Account..." : (
          <>
            <UserPlus size={18} />
            <span>Create Account</span>
          </>
        )}
      </Button>
    </form>
  );
}
