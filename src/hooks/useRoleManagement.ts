
import { useState } from "react";

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

  const getRandomQuote = (roleType: string) => {
    const quotes = roleBasedQuotes[roleType as keyof typeof roleBasedQuotes] || roleBasedQuotes["Learner"];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const [currentQuote, setCurrentQuote] = useState(getRandomQuote(role));

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setCurrentQuote(getRandomQuote(newRole));
  };

  return {
    role,
    currentQuote,
    handleRoleChange,
  };
}
