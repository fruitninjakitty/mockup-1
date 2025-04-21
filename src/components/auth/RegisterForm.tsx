
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, KeyRound } from "lucide-react";

// Helper to get all users from localStorage
function getStoredUsers() {
  const users = localStorage.getItem("userList");
  return users ? JSON.parse(users) : [];
}

function storeUser(userData: any) {
  const users = getStoredUsers();
  users.push(userData);
  localStorage.setItem("userList", JSON.stringify(users));
}

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

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setUserType("student");
    setSchoolCode("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    const users = getStoredUsers();
    if (users.some((u: any) => u.email === email)) {
      toast({
        title: "Email taken",
        description: "This email address is already registered.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      password,
      userType,
      schoolCode,
      learningGoal: "professional",
      focusArea: "skills",
      learningSchedule: "morning",
      bio: ""
    };

    storeUser(userData);
    localStorage.setItem("userProfile", JSON.stringify(userData));
    
    toast({
      title: "Account created!",
      description: "Registration successful. Welcome!",
      duration: 1800,
    });

    resetFields();
    navigate("/onboarding");
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
        aria-label="Create Account"
      >
        <UserPlus size={18} />
        <span>Create Account</span>
      </Button>
    </form>
  );
}
