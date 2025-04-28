
import { useState } from "react";
import { ApprovalRequest } from "@/components/approval/ApprovalRequest";
import { CreateCourseForm } from "@/components/courses/CreateCourseForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CreateCourseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkTeacherStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsTeacher(false);
        setIsApproved(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', user.id)
        .single();

      setIsTeacher(profile?.role === 'teacher');
      setIsApproved(!!profile?.is_approved);
    } catch (error) {
      console.error("Error checking teacher status:", error);
      setIsTeacher(false);
      setIsApproved(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      checkTeacherStatus();
    }
    setIsOpen(open);
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Add the details for your new course. You can edit these later.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-6 text-center">
            <p>Checking authorization...</p>
          </div>
        ) : isTeacher && isApproved ? (
          <CreateCourseForm onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} />
        ) : isTeacher && !isApproved ? (
          <ApprovalRequest />
        ) : (
          <div className="py-6">
            <p className="text-center text-muted-foreground">
              You need to be a teacher to create courses. 
              Please update your role in your profile settings.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
