
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAdminRegistration() {
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
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);
  const [formError, setFormError] = useState("");

  const generateOrganizationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

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
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes("Email signups are disabled")) {
          setFormError("Email signups are currently disabled. Please contact the administrator to enable email signups.");
        } else {
          setFormError(authError.message);
        }
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

      // Check if email confirmation is required
      if (authData.session === null) {
        setEmailConfirmRequired(true);
        toast({
          title: "Email verification required",
          description: "Please check your email to verify your account before continuing",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      // Wait for the auth to complete and profiles trigger to run
      // This small delay helps ensure the profile is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Now sign in to get authenticated session
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
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
          setIsLoading(false);
          return;
        }
        
        toast({
          title: "Sign in failed",
          description: signInError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!signInData.session) {
        setEmailConfirmRequired(true);
        toast({
          title: "Email verification required",
          description: "Please check your email to verify your account before continuing",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      // 3. Create the organization (now authenticated as the new user)
      try {
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
          console.error("Organization creation error:", orgError);
          
          // Handle the infinite recursion error explicitly
          if (orgError.message.includes("infinite recursion")) {
            setFormError("There was an issue with permission settings. Please try again or contact support.");
            toast({
              title: "Registration issue",
              description: "Permission configuration error. Please try again or contact support.",
              variant: "destructive",
            });
          } else {
            setFormError(`Failed to create organization: ${orgError.message}`);
            toast({
              title: "Failed to create organization",
              description: orgError.message,
              variant: "destructive",
            });
          }
          
          setIsLoading(false);
          return;
        }

        if (!orgData) {
          setFormError("Organization was created but no data was returned");
          toast({
            title: "Partial registration",
            description: "Your account was created but organization setup failed",
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
          console.error("Profile update error:", profileError);
          setFormError(`Profile update failed: ${profileError.message}`);
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
      } catch (err: any) {
        console.error("Organization creation caught error:", err);
        setFormError(`Unexpected error during organization creation: ${err.message || "Unknown error"}`);
        toast({
          title: "Registration issue",
          description: "There was a problem setting up your organization",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setFormError(`An unexpected error occurred: ${error.message || "Unknown error"}`);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    organizationName,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    organizationCode,
    showOrganizationCode,
    emailConfirmRequired,
    formError,
    setOrganizationName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    handleRegister
  };
}
