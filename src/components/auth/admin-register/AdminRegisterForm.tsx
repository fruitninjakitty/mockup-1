
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AdminRegisterFormFields } from "./AdminRegisterFormFields";
import { EmailVerificationRequired } from "./EmailVerificationRequired";
import { OrganizationCodeDisplay } from "./OrganizationCodeDisplay";
import { AdminRegisterErrorMessage } from "./components/AdminRegisterErrorMessage";
import { useAdminRegistration } from "./hooks/useAdminRegistration";

export function AdminRegisterForm() {
  const navigate = useNavigate();
  
  const {
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
  } = useAdminRegistration();

  if (emailConfirmRequired) {
    return <EmailVerificationRequired email={email} onReload={() => window.location.reload()} />;
  }

  if (showOrganizationCode) {
    return (
      <OrganizationCodeDisplay 
        organizationCode={organizationCode} 
        onContinue={() => navigate("/courses")} 
      />
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <AdminRegisterErrorMessage formError={formError} />
      
      <AdminRegisterFormFields
        organizationName={organizationName}
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        onOrganizationNameChange={setOrganizationName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
      />

      <Button
        type="submit"
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold mt-4 rounded-md flex items-center justify-center gap-2"
        disabled={isLoading}
        aria-label="Register as Administrator"
      >
        {isLoading ? "Creating Account..." : (
          <>
            <UserPlus size={18} />
            <span>Register as Administrator</span>
          </>
        )}
      </Button>
    </form>
  );
}
