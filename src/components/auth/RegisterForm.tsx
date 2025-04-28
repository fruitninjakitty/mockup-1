import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "./FormFields/PersonalInfoFields";
import { UserTypeFields } from "./FormFields/UserTypeFields";
import { SchoolCodeField } from "./FormFields/SchoolCodeField";
import { PasswordFields } from "./FormFields/PasswordFields";

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

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
        toast({
          title: "Invalid school code",
          description: "The school/organization code you entered is not valid",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim()
          }
        }
      });

      if (authError) {
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

      let role = 'learner';
      if (userType === 'teacher') role = 'teacher';
      if (userType === 'assistant') role = 'teaching_assistant';

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          organization_id: orgData.id,
          role: role as any
        })
        .eq('id', authData.user.id);

      if (profileError) {
        toast({
          title: "Failed to update profile",
          description: profileError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Account created!",
        description: "Registration successful. Welcome!",
        duration: 1800,
      });

      navigate("/onboarding");
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
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
