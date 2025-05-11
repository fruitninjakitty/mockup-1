
import { Database } from "@/integrations/supabase/types";

export type DisplayRole = "Learner" | "Teacher" | "Teaching Assistant" | "Administrator";
export type DatabaseRole = Database["public"]["Enums"]["user_role"];
