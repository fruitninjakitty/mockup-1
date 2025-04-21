import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher" | "assistant">("student");
  const [schoolCode, setSchoolCode] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials
    navigate("/courses");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would store this user data in a database
    // For now, let's store it in localStorage to access it in the profile dashboard
    const userData = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      userType,
      schoolCode,
      learningGoal: "professional", // default values
      focusArea: "skills",
      learningSchedule: "morning",
      bio: ""
    };
    
    localStorage.setItem("userProfile", JSON.stringify(userData));
    
    // Start the onboarding process
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="card-gradient minimal-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">
              Welcome to Gooru Labs navigated learning platform
            </h1>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("login")}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "login" 
                    ? "bg-card shadow text-primary" 
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "register" 
                    ? "bg-card shadow text-primary" 
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Register
              </button>
            </div>
          </div>
          
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-border"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-border"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-medium mt-2">
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full border-border" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full border-border" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Input 
                type="email" 
                placeholder="Email ID" 
                className="w-full border-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <div className="space-y-2">
                <Label className="text-sm text-gray-700">Are you a:</Label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={(value) => setUserType(value as "student" | "teacher" | "assistant")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teacher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assistant" id="assistant" />
                    <Label htmlFor="assistant">Teaching Assistant</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Input 
                type="text" 
                placeholder="School Code" 
                className="w-full border-border"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                required
              />
              
              <Input 
                type="password" 
                placeholder="Password" 
                className="w-full border-border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Input 
                type="password" 
                placeholder="Re-enter Password" 
                className="w-full border-border"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-medium mt-1">
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
