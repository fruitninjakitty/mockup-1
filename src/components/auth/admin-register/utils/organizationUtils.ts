
/**
 * Utility functions for organization-related operations
 */

/**
 * Generates a random 6-character alphanumeric organization code
 * @returns A randomly generated organization code
 */
export const generateOrganizationCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Validates form input for organization registration
 * @param password The user's password
 * @param confirmPassword The password confirmation
 * @returns An object containing validation result and error message
 */
export const validateRegistrationForm = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorMessage: "Passwords don't match"
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      errorMessage: "Password must be at least 6 characters"
    };
  }

  return { isValid: true, errorMessage: "" };
};
