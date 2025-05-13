
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DisplayRole } from "@/types/roles";
import { dbRoleToDisplayRole, displayRoleToDbRole, isRoleCompatible } from "@/utils/roleUtils";
import { getRandomQuote } from "@/utils/roleQuotes";

export function useRoleManagement() {
  const [roles, setRoles] = useState<DisplayRole[]>(["Learner"]); // Default role
  const [availableRoles, setAvailableRoles] = useState<DisplayRole[]>([]);
  const { toast } = useToast();
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(["Learner"]));
  const [isLoading, setIsLoading] = useState(true);

  // Get user roles from database
  useEffect(() => {
    const getUserRoles = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log("No session found, using default role");
          setDefaultRole();
          return;
        }

        // First try to check if the user has a role in their profile
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && profile && profile.role) {
            console.log("Found role in profile:", profile.role);
            const userRole = dbRoleToDisplayRole(profile.role);
            setRoles([userRole]);
            updateAvailableRoles([userRole]);
            setCurrentQuote(getRandomQuote([userRole]));
            setIsLoading(false);
            return;
          } else {
            console.log("No role found in profile or error occurred:", error);
          }
        } catch (profileError) {
          console.error("Error checking user profile:", profileError);
        }

        // If we couldn't fetch the profile or there was no role, set a default role
        console.log("Setting default role");
        setDefaultRole();
        
        // Try to update the user's role in the database to learner
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'learner' })
            .eq('id', session.user.id);
            
          if (updateError) {
            console.error("Error setting default role:", updateError);
          }
        } catch (updateError) {
          console.error("Exception setting default role:", updateError);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setDefaultRole();
      } finally {
        setIsLoading(false);
      }
    };

    getUserRoles();
  }, [toast]);

  // Helper function to set default role
  const setDefaultRole = () => {
    const defaultRole: DisplayRole = "Learner";
    setRoles([defaultRole]);
    updateAvailableRoles([defaultRole]);
    setCurrentQuote(getRandomQuote([defaultRole]));
  };

  // Update available roles based on current roles
  const updateAvailableRoles = (currentRoles: DisplayRole[]) => {
    const allRoles: DisplayRole[] = ["Learner", "Teacher", "Teaching Assistant", "Administrator"];
    
    // Filter roles that are compatible with current roles
    const available = allRoles.filter(role => 
      // Include current role and roles that are compatible
      currentRoles.includes(role) || isRoleCompatible(currentRoles, role)
    );
    
    setAvailableRoles(available);
  };

  const handleRoleChange = async (newRole: DisplayRole) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to change roles",
          variant: "destructive",
        });
        return;
      }

      const dbRole = displayRoleToDbRole(newRole);

      const { error } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', session.user.id);

      if (error) {
        console.error("Error updating role:", error);
        toast({
          title: "Error",
          description: "Could not update your role",
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
        description: "Could not update your role",
        variant: "destructive",
      });
    }
  };

  return {
    roles,
    availableRoles,
    currentQuote,
    handleRoleChange,
    isLoading,
  };
}
