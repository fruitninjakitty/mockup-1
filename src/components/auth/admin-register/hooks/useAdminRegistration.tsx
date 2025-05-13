
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthRegistration } from "./useAuthRegistration";
import { useOrganizationCreation } from "./useOrganizationCreation";
import { generateOrganizationCode, validateRegistrationForm } from "../utils/organizationUtils";

/**
 * Main hook for administrator registration flow
 */
export function useAdminRegistration() {
  const { toast } = useToast();
  const { registerUser, isLoading: authLoading, emailConfirmRequired } = useAuthRegistration();
  const { createOrganization, isLoading: orgLoading } = useOrganizationCreation();
  
  // Form state
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Registration state
  const [organizationCode, setOrganizationCode] = useState("");
  const [showOrganizationCode, setShowOrganizationCode] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Combined loading state
  const isLoading = authLoading || orgLoading;

  /**
   * Handles the registration form submission
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate form
    const validation = validateRegistrationForm(password, confirmPassword);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Generate a unique organization code
    const generatedCode = generateOrganizationCode();
    setOrganizationCode(generatedCode);

    // Register the user
    const authResult = await registerUser({
      email,
      password,
      firstName,
      lastName
    });

    if (!authResult) {
      return; // Error already handled in registerUser
    }

    // If email confirmation is required, don't proceed with organization creation
    if (authResult.emailConfirmRequired) {
      return;
    }

    // Create the organization and update user profile
    const organizationResult = await createOrganization(
      authResult.user.id,
      organizationName,
      generatedCode
    );

    if (organizationResult.success) {
      setShowOrganizationCode(true);
    } else {
      setFormError(organizationResult.error || "Failed to create organization");
    }
  };

  return {
    // Form state and handlers
    organizationName,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    setOrganizationName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    
    // Registration state
    organizationCode,
    showOrganizationCode,
    emailConfirmRequired,
    formError,
    isLoading,
    
    // Form submission handler
    handleRegister
  };
}
