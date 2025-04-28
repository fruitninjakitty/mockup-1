
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useApprovalRequest() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const submitRequest = async () => {
    setIsPending(true);
    
    try {
      // First, get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User must be logged in to submit an approval request");
      }

      // Now insert the approval request with the user's ID
      const { error } = await supabase
        .from('approval_requests')
        .insert({ 
          user_id: user.id,
          status: 'pending' 
        });

      if (error) throw error;

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

  return { submitRequest, isPending };
}
