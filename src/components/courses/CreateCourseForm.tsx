
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function CreateCourseForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a course.",
          variant: "destructive",
        });
        return;
      }

      // Check if user is an approved teacher
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'teacher' || !profile.is_approved) {
        toast({
          title: "Access Denied",
          description: "Only approved teachers can create courses. Please request approval if you haven't already.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("courses").insert({
        title,
        description,
        image: "/placeholder.svg",
        created_by: user.id
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Course created successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Could not create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Course Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Introduction to Programming"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Course Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your course..."
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </div>
    </form>
  );
}
