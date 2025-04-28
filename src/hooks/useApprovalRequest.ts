
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useApprovalRequest() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const submitRequest = async () => {
    setIsPending(true);
    
    try {
      const { error } = await supabase
        .from('approval_requests')
        .insert({ status: 'pending' });

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
