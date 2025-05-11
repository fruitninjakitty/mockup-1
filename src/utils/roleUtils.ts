
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
  
  // Don't add if already exists
  if (currentRoles.includes(roleToAdd)) {
    return false;
  }
  
  return true;
};
