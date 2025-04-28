
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApprovalRequest } from "@/hooks/useApprovalRequest";
import { supabase } from "@/integrations/supabase/client";

export function ApprovalRequest() {
  const { submitRequest, isPending } = useApprovalRequest();
  const [hasRequest, setHasRequest] = useState(false);

  useEffect(() => {
    const checkExistingRequest = async () => {
      const { data: requests } = await supabase
        .from('approval_requests')
        .select('status')
        .eq('status', 'pending')
        .maybeSingle();

      setHasRequest(!!requests);
    };

    checkExistingRequest();
  }, []);

  if (hasRequest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Pending</CardTitle>
          <CardDescription>
            Your request for teacher approval is being reviewed. You'll be notified once it's processed.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Teacher Approval</CardTitle>
        <CardDescription>
          To create and manage courses, you need to be an approved teacher.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={submitRequest} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Submitting..." : "Request Approval"}
        </Button>
      </CardContent>
    </Card>
  );
}
