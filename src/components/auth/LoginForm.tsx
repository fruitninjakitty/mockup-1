
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state, or default to /courses
  const from = location.state?.from || "/courses";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          variant: "default",
          duration: 1800,
        });
        
        // Redirect to the page user was trying to access, or courses page
        navigate(from);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-1">
        <Label htmlFor="login-email" className="text-[#43BC88] text-sm font-semibold flex items-center gap-2">
          <Mail size={17} className="text-[#43BC88]" />
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border-border"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold mt-2 rounded-md flex items-center justify-center gap-2"
        disabled={isLoading}
        aria-label="Sign In"
      >
        {isLoading ? (
          "Signing in..."
        ) : (
          <>
            <LogIn size={18} />
            <span>Sign In</span>
          </>
        )}
      </Button>
    </form>
  );
}
