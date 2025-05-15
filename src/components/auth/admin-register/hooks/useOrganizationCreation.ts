
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface OrganizationCreationResult {
  success: boolean;
  organizationId?: string;
  error?: string;
}

/**
 * Hook for handling organization creation during admin registration
 */
export function useOrganizationCreation() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Creates a new organization and updates the user's profile
   */
  const createOrganization = async (
    userId: string,
    organizationName: string,
    organizationCode: string
  ): Promise<OrganizationCreationResult> => {
    setIsLoading(true);
    
    try {
      console.log("Creating organization for user:", userId);
      
      // Create the organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          code: organizationCode,
          created_by: userId
        })
        .select()
        .single();

      if (orgError) {
        console.error("Organization creation error:", orgError);
        return {
          success: false,
          error: orgError.message
        };
      }

      console.log("Organization created successfully:", orgData);

      // Update the user's profile with organization_id and explicitly set administrator role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          organization_id: orgData.id,
          role: 'administrator' // Ensure role is set to administrator
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        return {
          success: false,
          error: profileError.message
        };
      }

      console.log("Profile updated with organization_id and administrator role");

      // Also ensure the role exists in the user_roles table
      const { error: roleError } = await supabase.rpc(
        'add_role_to_user',
        { _user_id: userId, _role: 'administrator' }
      );

      if (roleError) {
        console.error("Error adding administrator role:", roleError);
        // Don't fail the overall process for this
      } else {
        console.log("Administrator role added to user_roles table");
      }

      toast({
        title: "Registration successful!",
        description: "Your administrator account has been created",
        duration: 3000,
      });

      return {
        success: true,
        organizationId: orgData.id
      };
      
    } catch (error: any) {
      console.error("Unexpected error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred"
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading
  };
}
