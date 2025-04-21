
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

function findUser(email: string, password: string) {
  // Special admin check first
  if (email === "admin" && password === "admin") {
    return { isAdmin: true, fullName: "Admin" };
  }
  const users = getStoredUsers();
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (user) {
    return { ...user, isAdmin: false };
  }
  return null;
}

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

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setUserType("student");
    setSchoolCode("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = findUser(email, password);

    if (user) {
      localStorage.setItem("userProfile", JSON.stringify(user));
      toast({
        title: "Login successful",
        variant: "default",
        duration: 1800,
      });
      navigate("/courses");
    } else {
      toast({
        title: "Invalid credentials",
        description: "Incorrect email or password.",
        variant: "destructive",
      });
    }
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

    // Ensure email not taken
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
      learningGoal: "professional", // default values
      focusArea: "skills",
      learningSchedule: "morning",
      bio: ""
    };

    // Save to local storage user list and set as current profile
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FA] via-[#FFFFFF] to-[#E2F0FA]">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="card-gradient minimal-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: "#518CCA" }}>
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
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "register" 
                    ? "bg-card shadow text-primary" 
                    : "text-gray-500 hover:text-gray-900"
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
                  type="text"
                  placeholder="Email or username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border-border"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border-border"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium mt-2 rounded-md">
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full border-border" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full border-border" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
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
                <Label className="text-sm text-foreground/80">Are you a:</Label>
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
              <Button type="submit" className="w-full bg-secondary hover:bg-primary text-white font-medium mt-1 rounded-md">
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
