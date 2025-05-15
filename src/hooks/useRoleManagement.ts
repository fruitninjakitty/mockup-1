
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

        console.log("Fetching roles for user:", session.user.id);

        // Get all roles for the current user from user_roles table
        try {
          const { data: userRoles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);

          if (!error && userRoles && userRoles.length > 0) {
            console.log("Found user roles:", userRoles);
            const displayRoles = userRoles.map(ur => dbRoleToDisplayRole(ur.role));
            setRoles(displayRoles);
            updateAvailableRoles(displayRoles);
            setCurrentQuote(getRandomQuote(displayRoles));
            setIsLoading(false);
            return;
          } else {
            console.log("No roles found in user_roles or error occurred:", error);
          }
        } catch (rolesError) {
          console.error("Error checking user roles:", rolesError);
        }

        // If we couldn't fetch from user_roles, check the profile for the primary role
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!error && profile && profile.role) {
            console.log("Found role in profile:", profile.role);
            const userRole = dbRoleToDisplayRole(profile.role);
            console.log("Converted to display role:", userRole);
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
  }, []);

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

      // First update the primary role in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', session.user.id);

      if (profileError) {
        console.error("Error updating primary role:", profileError);
        toast({
          title: "Error",
          description: "Could not update your primary role",
          variant: "destructive",
        });
        return;
      }

      // Now add or ensure this role exists in the user_roles table
      const { data, error: roleError } = await supabase.rpc(
        'add_role_to_user',
        { _user_id: session.user.id, _role: dbRole }
      );

      if (roleError) {
        console.error("Error adding role:", roleError);
        toast({
          title: "Error",
          description: "Could not add role",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setRoles([newRole]);
      updateAvailableRoles([newRole]);
      setCurrentQuote(getRandomQuote([newRole]));
      
      toast({
        title: "Success",
        description: `Your primary role has been updated to ${newRole}`,
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

  // Add a secondary role to the current user
  const addSecondaryRole = async (roleToAdd: DisplayRole) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error", 
          description: "You must be logged in to add roles",
          variant: "destructive",
        });
        return;
      }

      // Check role compatibility
      if (!isRoleCompatible(roles, roleToAdd)) {
        toast({
          title: "Incompatible Role",
          description: `The role ${roleToAdd} is not compatible with your current roles`,
          variant: "destructive",
        });
        return;
      }
      
      const dbRole = displayRoleToDbRole(roleToAdd);
      
      // Add the role using the RPC function
      const { data, error } = await supabase.rpc(
        'add_role_to_user',
        { _user_id: session.user.id, _role: dbRole }
      );

      if (error) {
        console.error("Error adding secondary role:", error);
        toast({
          title: "Error",
          description: "Could not add the secondary role",
          variant: "destructive",
        });
        return;
      }

      // Update local state by adding the new role
      const updatedRoles = [...roles];
      if (!updatedRoles.includes(roleToAdd)) {
        updatedRoles.push(roleToAdd);
      }
      
      setRoles(updatedRoles);
      updateAvailableRoles(updatedRoles);
      setCurrentQuote(getRandomQuote(updatedRoles));
      
      toast({
        title: "Success",
        description: `Added secondary role: ${roleToAdd}`,
      });
    } catch (error) {
      console.error("Error adding secondary role:", error);
      toast({
        title: "Error",
        description: "Could not add the secondary role",
        variant: "destructive",
      });
    }
  };

  // Remove a secondary role from the current user
  const removeSecondaryRole = async (roleToRemove: DisplayRole) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to remove roles",
          variant: "destructive",
        });
        return;
      }
      
      const dbRole = displayRoleToDbRole(roleToRemove);
      
      // Remove the role using the RPC function
      const { data, error } = await supabase.rpc(
        'remove_role_from_user',
        { _user_id: session.user.id, _role: dbRole }
      );

      if (error) {
        console.error("Error removing secondary role:", error);
        toast({
          title: "Error",
          description: "Could not remove the role",
          variant: "destructive",
        });
        return;
      }

      if (data === false) {
        toast({
          title: "Cannot Remove Primary Role",
          description: "You cannot remove your primary role",
          variant: "default",
        });
        return;
      }

      // Update local state by removing the role
      const updatedRoles = roles.filter(role => role !== roleToRemove);
      
      setRoles(updatedRoles);
      updateAvailableRoles(updatedRoles);
      setCurrentQuote(getRandomQuote(updatedRoles));
      
      toast({
        title: "Success",
        description: `Removed role: ${roleToRemove}`,
      });
    } catch (error) {
      console.error("Error removing secondary role:", error);
      toast({
        title: "Error",
        description: "Could not remove the role",
        variant: "destructive",
      });
    }
  };

  return {
    roles,
    availableRoles,
    currentQuote,
    handleRoleChange,
    addSecondaryRole,
    removeSecondaryRole,
    isLoading,
  };
}
