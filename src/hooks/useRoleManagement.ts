
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type DisplayRole = "Learner" | "Teacher" | "Teaching Assistant" | "Administrator";
type DatabaseRole = Database["public"]["Enums"]["user_role"];

const roleBasedQuotes = {
  Learner: [
    "Continue your learning journey, every step forward is progress.",
    "The best investment you can make is in your own education.",
    "Learning is a treasure that will follow its owner everywhere.",
  ],
  Teacher: [
    "Great teachers inspire minds and change lives forever.",
    "Teaching is the profession that teaches all other professions.",
    "The influence of a good teacher can never be erased.",
  ],
  "Teaching Assistant": [
    "Supporting others in their learning journey is a noble pursuit.",
    "Your guidance helps bridge the gap between teaching and understanding.",
    "Behind every successful student is a dedicated teaching team.",
  ],
  "Administrator": [
    "Effective administration creates the foundation for educational excellence.",
    "Good leadership empowers both teachers and students to reach their potential.",
    "Managing education systems requires vision, wisdom, and dedication.",
  ],
} as const;

const dbRoleToDisplayRole = (dbRole: DatabaseRole | null | undefined): DisplayRole => {
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

const displayRoleToDbRole = (displayRole: DisplayRole): DatabaseRole => {
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

// Role compatibility rules
const isRoleCompatible = (currentRoles: DisplayRole[], roleToAdd: DisplayRole): boolean => {
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

export function useRoleManagement() {
  const [roles, setRoles] = useState<DisplayRole[]>(["Learner"]); // Default role
  const [availableRoles, setAvailableRoles] = useState<DisplayRole[]>([]);
  const { toast } = useToast();

  // Get user roles from database
  useEffect(() => {
    const getUserRoles = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // First try to check if the user has a role
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!error && profile) {
            const userRole = dbRoleToDisplayRole(profile.role as DatabaseRole);
            setRoles([userRole]);
            updateAvailableRoles([userRole]);
            return;
          }
        } catch (profileError) {
          console.error("Error checking user profile:", profileError);
        }

        // If we couldn't fetch the profile or there was no role, set a default role
        const defaultRole: DisplayRole = "Learner";
        setRoles([defaultRole]);
        updateAvailableRoles([defaultRole]);
        
        // Try to update the user's role in the database to learner
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'learner' as DatabaseRole })
            .eq('id', session.user.id);
            
          if (updateError) {
            console.error("Error setting default role:", updateError);
          }
        } catch (updateError) {
          console.error("Exception setting default role:", updateError);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        // Even if there's an error, make sure we have default roles
        const defaultRole: DisplayRole = "Learner";
        setRoles([defaultRole]);
        updateAvailableRoles([defaultRole]);
      }
    };

    getUserRoles();
  }, [toast]);

  // Update available roles based on current roles
  const updateAvailableRoles = (currentRoles: DisplayRole[]) => {
    const allRoles: DisplayRole[] = ["Learner", "Teacher", "Teaching Assistant", "Administrator"];
    const available = allRoles.filter(role => isRoleCompatible(currentRoles, role));
    setAvailableRoles(available);
  };

  const getRandomQuote = (userRoles: DisplayRole[]) => {
    if (userRoles.length === 0) return "Welcome to the learning platform.";
    
    // Prioritize quotes based on primary role
    const primaryRole = userRoles[0];
    const quotes = roleBasedQuotes[primaryRole];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(roles));

  const handleRoleChange = async (newRole: DisplayRole) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const dbRole = displayRoleToDbRole(newRole);

      const { error } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', session.user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Could not update user role",
          variant: "destructive",
        });
        return;
      }

      setRoles([newRole]);
      updateAvailableRoles([newRole]);
      setCurrentQuote(getRandomQuote([newRole]));
      
      toast({
        title: "Success",
        description: `Your role has been updated to ${newRole}`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Could not update user role",
        variant: "destructive",
      });
    }
  };

  return {
    roles,
    availableRoles,
    currentQuote,
    handleRoleChange,
  };
}
