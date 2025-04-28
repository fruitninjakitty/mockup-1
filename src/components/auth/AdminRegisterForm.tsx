
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, Building, User, KeyRound, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AdminRegisterForm() {
  const navigate = useNavigate();
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

  const generateOrganizationCode = () => {
    // Generate a random 6-character alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
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

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique organization code
    const generatedCode = generateOrganizationCode();
    setOrganizationCode(generatedCode);

    setIsLoading(true);

    try {
      // 1. Create the user account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
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

      // Wait for the auth to complete and profiles trigger to run
      // This small delay helps ensure the profile is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Now sign in to get authenticated session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast({
          title: "Sign in failed",
          description: signInError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 3. Create the organization (now authenticated as the new user)
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
        toast({
          title: "Failed to create organization",
          description: orgError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 4. Update the user's profile with organization_id and admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          organization_id: orgData.id,
          role: 'administrator'
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

      // Show the code to the admin
      setShowOrganizationCode(true);
      toast({
        title: "Registration successful!",
        description: "Your administrator account has been created",
        duration: 3000,
      });

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

  const handleContinue = () => {
    navigate("/courses");
  };

  if (showOrganizationCode) {
    return (
      <div className="text-center space-y-6">
        <div className="p-6 bg-[#E6FAF0] rounded-lg border-2 border-[#43BC88]">
          <h2 className="text-xl font-bold text-[#43BC88] mb-2">Your Organization Code</h2>
          <p className="text-sm text-gray-600 mb-4">
            Share this code with teachers and students to join your organization:
          </p>
          <div className="bg-white py-4 px-6 rounded-md border border-[#43BC88] font-mono text-2xl font-bold tracking-wider">
            {organizationCode}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Please save this code. You will need it to add new members.
          </p>
        </div>
        <Button
          onClick={handleContinue}
          className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold rounded-md"
        >
          Continue to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="org-name" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Building size={16} className="text-[#43BC88]" /> Organization Name
        </Label>
        <Input
          id="org-name"
          type="text"
          placeholder="Enter your institution name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="w-full border-border"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="admin-firstname" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <User size={16} className="text-[#43BC88]" /> First Name
          </Label>
          <Input
            id="admin-firstname"
            type="text"
            placeholder="First Name"
            className="w-full border-border"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin-lastname" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <User size={16} className="text-[#43BC88]" /> Last Name
          </Label>
          <Input
            id="admin-lastname"
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
        <Label htmlFor="admin-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Mail size={16} className="text-[#43BC88]" /> Email Address
        </Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="Enter your email"
          className="w-full border-border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="admin-password" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <Lock size={16} className="text-[#43BC88]" /> Password
          </Label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Create password"
            className="w-full border-border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin-confirm" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
            <KeyRound size={16} className="text-[#43BC88]" /> Confirm Password
          </Label>
          <Input
            id="admin-confirm"
            type="password"
            placeholder="Confirm password"
            className="w-full border-border"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

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
