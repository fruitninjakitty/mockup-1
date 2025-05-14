
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for handling organization creation during admin registration
 */
export function useOrganizationCreation() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Creates a new organization in Supabase and updates the user's profile
   */
  const createOrganization = async (
    userId: string, 
    organizationName: string, 
    organizationCode: string
  ) => {
    setIsLoading(true);
    
    try {
      console.log("Creating organization with name:", organizationName, "and code:", organizationCode);
      
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
        
        // Handle the infinite recursion error explicitly
        if (orgError.message.includes("infinite recursion")) {
          toast({
            title: "Registration issue",
            description: "Permission configuration error. Please try again or contact support.",
            variant: "destructive",
          });
          return { success: false, error: "There was an issue with permission settings. Please try again or contact support." };
        } else {
          toast({
            title: "Failed to create organization",
            description: orgError.message,
            variant: "destructive",
          });
          return { success: false, error: `Failed to create organization: ${orgError.message}` };
        }
      }

      console.log("Organization created:", orgData);

      if (!orgData) {
        toast({
          title: "Partial registration",
          description: "Your account was created but organization setup failed",
          variant: "destructive",
        });
        return { success: false, error: "Organization was created but no data was returned" };
      }

      // Update the user's profile with organization_id and admin role
      // Explicitly set the role as 'administrator' using the Database role type
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          organization_id: orgData.id,
          role: 'administrator' as const,
          is_approved: true  // Auto-approve administrators
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast({
          title: "Failed to update profile",
          description: profileError.message,
          variant: "destructive",
        });
        return { success: false, error: `Profile update failed: ${profileError.message}` };
      }

      console.log("Profile updated with organization_id and admin role");
      
      toast({
        title: "Registration successful!",
        description: "Your administrator account has been created",
        duration: 3000,
      });
      
      return { success: true, organizationId: orgData.id, error: null };
      
    } catch (err: any) {
      console.error("Organization creation caught error:", err);
      toast({
        title: "Registration issue",
        description: "There was a problem setting up your organization",
        variant: "destructive",
      });
      return { success: false, error: `Unexpected error during organization creation: ${err.message || "Unknown error"}` };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading
  };
}
