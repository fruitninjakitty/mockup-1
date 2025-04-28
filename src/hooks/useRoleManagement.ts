
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type DisplayRole = "Learner" | "Teacher" | "Teaching Assistant";
type DatabaseRole = "learner" | "teacher" | "teaching_assistant";

const roleBasedQuotes = {
  Learner: [
    "Continue your learning journey, every step forward is progress.",
    "The best investment you can make is in your own education.",
    "Learning is a treasure that will follow its owner everywhere.",
  ],
  Teacher: [
    "Great teachers inspire minds and change lives forever.",
    "Teaching is the profession that teaches all other professions.",
    "The influence of a good teacher can never be erased.",
  ],
  "Teaching Assistant": [
    "Supporting others in their learning journey is a noble pursuit.",
    "Your guidance helps bridge the gap between teaching and understanding.",
    "Behind every successful student is a dedicated teaching team.",
  ],
} as const;

const dbRoleToDisplayRole = (dbRole: DatabaseRole): DisplayRole => {
  switch (dbRole) {
    case "teaching_assistant":
      return "Teaching Assistant";
    case "teacher":
      return "Teacher";
    case "learner":
      return "Learner";
  }
};

const displayRoleToDbRole = (displayRole: DisplayRole): DatabaseRole => {
  switch (displayRole) {
    case "Teaching Assistant":
      return "teaching_assistant";
    case "Teacher":
      return "teacher";
    case "Learner":
      return "learner";
  }
};

export function useRoleManagement() {
  const [role, setRole] = useState<DisplayRole>("Learner");
  const { toast } = useToast();

  useEffect(() => {
    const getUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Could not fetch user role",
            variant: "destructive",
          });
          return;
        }

        if (profile) {
          setRole(dbRoleToDisplayRole(profile.role));
        }
      }
    };

    getUserRole();
  }, [toast]);

  const getRandomQuote = (roleType: DisplayRole) => {
    const quotes = roleBasedQuotes[roleType];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(role));

  const handleRoleChange = async (newRole: DisplayRole) => {
    const dbRole = displayRoleToDbRole(newRole);

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', session.user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Could not update user role",
          variant: "destructive",
        });
        return;
      }
    }

    setRole(newRole);
    setCurrentQuote(getRandomQuote(newRole));
  };

  return {
    role,
    currentQuote,
    handleRoleChange,
  };
}
