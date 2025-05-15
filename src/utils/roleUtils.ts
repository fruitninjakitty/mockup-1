
import { DisplayRole, DatabaseRole } from "@/types/roles";

/**
 * Converts a database role to a display role
 */
export const dbRoleToDisplayRole = (dbRole: DatabaseRole | null | undefined): DisplayRole => {
  if (!dbRole) return "Learner"; // Default role
  
  switch (dbRole) {
    case "teaching_assistant":
      return "Teaching Assistant";
    case "teacher":
      return "Teacher";
    case "administrator":
      return "Administrator";
    case "learner":
    default:
      return "Learner";
  }
};

/**
 * Converts a display role to a database role
 */
export const displayRoleToDbRole = (displayRole: DisplayRole): DatabaseRole => {
  switch (displayRole) {
    case "Teaching Assistant":
      return "teaching_assistant";
    case "Teacher":
      return "teacher";
    case "Administrator":
      return "administrator";
    case "Learner":
    default:
      return "learner";
  }
};

/**
 * Role compatibility rules
 * Returns whether a role can be added to the current roles
 */
export const isRoleCompatible = (currentRoles: DisplayRole[], roleToAdd: DisplayRole): boolean => {
  if (currentRoles.includes(roleToAdd)) {
    return true; // Current role is always compatible with itself
  }

  // Administrator cannot be combined with Learner or Teaching Assistant
  if (roleToAdd === "Administrator" && 
      (currentRoles.includes("Learner") || currentRoles.includes("Teaching Assistant"))) {
    return false;
  }
  
  // Learner or Teaching Assistant cannot be added if Administrator exists
  if ((roleToAdd === "Learner" || roleToAdd === "Teaching Assistant") && 
      currentRoles.includes("Administrator")) {
    return false;
  }
  
  // Teacher cannot be combined with Learner or Teaching Assistant
  if (roleToAdd === "Teacher" && 
      (currentRoles.includes("Learner") || currentRoles.includes("Teaching Assistant"))) {
    return false;
  }
  
  // Learner or Teaching Assistant cannot be added if Teacher exists
  if ((roleToAdd === "Learner" || roleToAdd === "Teaching Assistant") && 
      currentRoles.includes("Teacher")) {
    return false;
  }
  
  return true;
};

/**
 * Check if user has any role with specific permissions
 */
export const hasRoleWithPermission = (roles: DisplayRole[], permissionRoles: DisplayRole[]): boolean => {
  return roles.some(role => permissionRoles.includes(role));
};

/**
 * Gets highest priority role from a list of roles
 * Order: Administrator > Teacher > Teaching Assistant > Learner
 */
export const getPrimaryRole = (roles: DisplayRole[]): DisplayRole => {
  if (roles.includes("Administrator")) return "Administrator";
  if (roles.includes("Teacher")) return "Teacher";
  if (roles.includes("Teaching Assistant")) return "Teaching Assistant";
  return "Learner";
};

/**
 * Get all quotes for roles
 */
export const getQuoteForRole = (role: DisplayRole): string => {
  switch (role) {
    case 'Administrator':
      return "Managing education systems requires vision, wisdom, and dedication.";
    case 'Teacher':
      return "Great teachers inspire minds and change lives forever.";
    case 'Teaching Assistant':
      return "Supporting others in their learning journey is a noble pursuit.";
    case 'Learner':
    default:
      return "Continue your learning journey, every step forward is progress.";
  }
};
