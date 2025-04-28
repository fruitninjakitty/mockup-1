
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  // Check if school code exists
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
      // Validate school code exists before proceeding
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

      // 1. Verify the school code exists
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

      // 2. Create the user account
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

      // 3. Update the profile with organization_id and role
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="register-firstname" className="text-[#43BC88] text-sm font-semibold">
            First Name
          </Label>
          <Input
            id="register-firstname"
            type="text"
            placeholder="First Name"
            className="w-full border-border"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="register-lastname" className="text-[#43BC88] text-sm font-semibold">
            Last Name
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder="Last Name"
            className="w-full border-border"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Mail size={16} className="text-[#43BC88]" /> Email ID
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="Email ID"
          className="w-full border-border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[#43BC88] text-sm font-semibold">
          Are you a:
        </Label>
        <RadioGroup
          value={userType}
          onValueChange={(value) =>
            setUserType(value as "student" | "teacher" | "assistant")
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student" className="text-[#43BC88]">Student</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="teacher" id="teacher" />
            <Label htmlFor="teacher" className="text-[#43BC88]">Teacher</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="assistant" id="assistant" />
            <Label htmlFor="assistant" className="text-[#43BC88]">Teaching Assistant</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-school" className="text-[#43BC88] text-sm font-semibold">
          School Code
        </Label>
        <Input
          id="register-school"
          type="text"
          placeholder="School Code"
          className="w-full border-border"
          value={schoolCode}
          onChange={(e) => setSchoolCode(e.target.value)}
          required
        />
      </div>
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
            onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>
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
