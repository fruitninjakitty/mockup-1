
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, LogIn } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract code from URL if present (for school code pre-fill)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code) {
      localStorage.setItem('schoolCode', code);
    }
  }, [location.search]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate("/courses");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Authentication failed";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Mail size={16} className="text-[#43BC88]" /> Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border-border w-full"
          required
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="password" className="text-[#43BC88] text-sm font-semibold flex items-center gap-1">
          <Lock size={16} className="text-[#43BC88]" /> Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="border-border w-full"
          required
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold rounded-md flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : (
            <>
              <LogIn size={18} />
              <span>Login</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
