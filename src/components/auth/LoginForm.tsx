
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";

// Helper to get all users from localStorage
function getStoredUsers() {
  const users = localStorage.getItem("userList");
  return users ? JSON.parse(users) : [];
}

function findUser(email: string, password: string) {
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

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="login-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-2">
          <Mail size={17} className="text-[#43BC88]" />
          Email or username
        </Label>
        <Input
          id="login-email"
          type="text"
          placeholder="Email or username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border-border"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="login-password" className="text-[#43BC88] text-sm font-semibold flex items-center gap-2">
          <Lock size={17} className="text-[#43BC88]" />
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border-border"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold mt-2 rounded-md flex items-center justify-center gap-2"
        aria-label="Sign In"
      >
        <LogIn size={18} />
        <span>Sign In</span>
      </Button>
    </form>
  );
}
