
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApprovalRequest } from "@/hooks/useApprovalRequest";
import { Loader2 } from "lucide-react";

export function ApprovalRequest() {
  const { submitRequest, isPending, hasRequest, isLoading, checkExistingRequest } = useApprovalRequest();

  useEffect(() => {
    checkExistingRequest();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking request status...</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (hasRequest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Pending</CardTitle>
          <CardDescription>
            Your request for teacher approval is being reviewed by an administrator. You'll be notified once it's processed.
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
          To create and manage courses, you need to be an approved teacher. Your request will be reviewed by an administrator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={submitRequest} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Request Approval"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
