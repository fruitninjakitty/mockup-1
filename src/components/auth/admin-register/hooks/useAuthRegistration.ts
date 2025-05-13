
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UseAuthRegistrationProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthRegistrationResult {
  user: any;
  session: any;
  emailConfirmRequired: boolean;
}

/**
 * Hook for handling user authentication during admin registration
 */
export function useAuthRegistration() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);

  /**
   * Registers a new user with Supabase authentication
   */
  const registerUser = async ({
    email,
    password,
    firstName,
    lastName
  }: UseAuthRegistrationProps): Promise<AuthRegistrationResult | null> => {
    setIsLoading(true);
    
    try {
      // Create the user account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        let errorMessage = authError.message;
        if (authError.message.includes("Email signups are disabled")) {
          errorMessage = "Email signups are currently disabled. Please contact the administrator to enable email signups.";
        }
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return null;
      }

      if (!authData.user) {
        toast({
          title: "Registration error",
          description: "Failed to create user account",
          variant: "destructive",
        });
        return null;
      }

      // Check if email confirmation is required
      if (authData.session === null) {
        setEmailConfirmRequired(true);
        toast({
          title: "Email verification required",
          description: "Please check your email to verify your account before continuing",
          duration: 5000,
        });
        return { user: authData.user, session: null, emailConfirmRequired: true };
      }

      // Wait for the auth to complete and profiles trigger to run
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sign in to get authenticated session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        if (signInError.message.includes("Email not confirmed")) {
          setEmailConfirmRequired(true);
          toast({
            title: "Email verification required",
            description: "Please check your email to verify your account before continuing",
            duration: 5000,
          });
          return { user: authData.user, session: null, emailConfirmRequired: true };
        }
        
        toast({
          title: "Sign in failed",
          description: signInError.message,
          variant: "destructive",
        });
        return null;
      }

      if (!signInData.session) {
        setEmailConfirmRequired(true);
        toast({
          title: "Email verification required",
          description: "Please check your email to verify your account before continuing",
          duration: 5000,
        });
        return { user: authData.user, session: null, emailConfirmRequired: true };
      }

      return { 
        user: authData.user, 
        session: signInData.session, 
        emailConfirmRequired: false 
      };
      
    } catch (error: any) {
      console.error("Unexpected error during registration:", error);
      toast({
        title: "An error occurred",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading,
    emailConfirmRequired
  };
}
