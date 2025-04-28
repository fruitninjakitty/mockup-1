
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useApprovalRequest() {
  const [isPending, setIsPending] = useState(false);
  const [hasRequest, setHasRequest] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user already has a pending request
  const checkExistingRequest = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setHasRequest(false);
        return false;
      }

      // First get the user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) {
        toast({
          title: "Organization Required",
          description: "You need to be part of an organization to request teacher approval.",
          variant: "destructive",
        });
        setHasRequest(false);
        return false;
      }

      const { data: request, error } = await supabase
        .from('approval_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .eq('organization_id', profile.organization_id)
        .maybeSingle();

      if (error) throw error;
      
      const hasExistingRequest = !!request;
      setHasRequest(hasExistingRequest);
      return hasExistingRequest;
    } catch (error) {
      console.error('Error checking request:', error);
      setHasRequest(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitRequest = async () => {
    setIsPending(true);
    
    try {
      // Check if request already exists before submitting
      const alreadyHasRequest = await checkExistingRequest();
      if (alreadyHasRequest) {
        toast({
          title: "Request Already Exists",
          description: "You already have a pending approval request.",
          variant: "default",
        });
        return;
      }
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User must be logged in to submit an approval request");
      }

      // Get the user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) {
        toast({
          title: "Organization Required",
          description: "You need to be part of an organization to request teacher approval.",
          variant: "destructive",
        });
        return;
      }

      // Now insert the approval request with the user's ID and organization ID
      const { error } = await supabase
        .from('approval_requests')
        .insert({ 
          user_id: user.id,
          status: 'pending',
          organization_id: profile.organization_id
        });

      if (error) throw error;

      // Update local state to reflect the new request
      setHasRequest(true);
      
      toast({
        title: "Request Submitted",
        description: "Your teacher approval request has been submitted for review.",
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Could not submit approval request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return { submitRequest, isPending, hasRequest, isLoading, checkExistingRequest };
}
