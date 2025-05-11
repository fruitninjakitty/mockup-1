
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
            const userRole = dbRoleToDisplayRole(profile.role);
            setRoles([userRole]);
            updateAvailableRoles([userRole]);
            setCurrentQuote(getRandomQuote([userRole]));
            return;
          }
        } catch (profileError) {
          console.error("Error checking user profile:", profileError);
        }

        // If we couldn't fetch the profile or there was no role, set a default role
        const defaultRole: DisplayRole = "Learner";
        setRoles([defaultRole]);
        updateAvailableRoles([defaultRole]);
        setCurrentQuote(getRandomQuote([defaultRole]));
        
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
        // Even if there's an error, make sure we have default roles
        const defaultRole: DisplayRole = "Learner";
        setRoles([defaultRole]);
        updateAvailableRoles([defaultRole]);
        setCurrentQuote(getRandomQuote([defaultRole]));
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
