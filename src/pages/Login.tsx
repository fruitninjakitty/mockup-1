
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials
    navigate("/courses");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
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
              <Input 
                type="text" 
                placeholder="Full Name" 
                className="w-full border-gray-200" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input 
                type="email" 
                placeholder="Email" 
                className="w-full border-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                type="password" 
                placeholder="Password" 
                className="w-full border-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
