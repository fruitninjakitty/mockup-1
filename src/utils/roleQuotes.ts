
import { DisplayRole } from "@/types/roles";

export const roleBasedQuotes = {
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
  "Administrator": [
    "Effective administration creates the foundation for educational excellence.",
    "Good leadership empowers both teachers and students to reach their potential.",
    "Managing education systems requires vision, wisdom, and dedication.",
  ],
} as const;

/**
 * Returns a random quote based on the user's primary role
 */
export const getRandomQuote = (userRoles: DisplayRole[]): string => {
  if (userRoles.length === 0) return "Welcome to the learning platform.";
  
  // Prioritize quotes based on primary role
  const primaryRole = userRoles[0];
  const quotes = roleBasedQuotes[primaryRole];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
