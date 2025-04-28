
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
};

export function useRoleManagement() {
  const [role, setRole] = useState("Learner");
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
          // Convert database role to display role
          const displayRole = profile.role === 'teaching_assistant' ? 'Teaching Assistant' : 
                            profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
          setRole(displayRole);
        }
      }
    };

    getUserRole();
  }, []);

  const getRandomQuote = (roleType: string) => {
    const quotes = roleBasedQuotes[roleType as keyof typeof roleBasedQuotes] || roleBasedQuotes.Learner;
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(role));

  const handleRoleChange = async (newRole: string) => {
    // Convert display role to database role
    const dbRole = newRole === 'Teaching Assistant' ? 'teaching_assistant' : 
                  newRole.toLowerCase();

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
