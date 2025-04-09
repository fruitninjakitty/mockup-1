
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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f8f7]">
      <div className="w-full max-w-md p-4 animate-fade-up">
        <div className="bg-white shadow-sm rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#43bc88]">
              Welcome to Gooru Labs navigated learning platform
            </h1>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => setActiveTab("login")}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "login" 
                    ? "bg-white shadow-sm text-[#43bc88]" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "register" 
                    ? "bg-white shadow-sm text-[#43bc88]" 
                    : "text-gray-600 hover:text-gray-800"
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
                  className="w-full border-gray-200"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-200"
                />
              </div>
              <Button type="submit" className="w-full bg-[#43bc88] hover:bg-[#3ba677]">
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
                    className="w-full border-gray-200" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full border-gray-200" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Input 
                type="email" 
                placeholder="Email ID" 
                className="w-full border-gray-200"
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
                className="w-full border-gray-200"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                required
              />
              
              <Input 
                type="password" 
                placeholder="Password" 
                className="w-full border-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Input 
                type="password" 
                placeholder="Re-enter Password" 
                className="w-full border-gray-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <Button type="submit" className="w-full bg-[#43bc88] hover:bg-[#3ba677]">
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
