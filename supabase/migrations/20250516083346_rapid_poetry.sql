/*
  # Database Structure Improvements

  1. Role Management
    - Add role hierarchy
    - Improve role constraints
    - Add role validation functions

  2. Profile Improvements
    - Add profile completion tracking
    - Improve avatar handling
    - Add profile settings

  3. Course Management
    - Add course types and status
    - Improve course access control
    - Add course progression tracking
*/

-- Create role hierarchy enum
CREATE TYPE public.role_level AS ENUM ('1_administrator', '2_teacher', '3_teaching_assistant', '4_learner');

-- Add role hierarchy table
CREATE TABLE IF NOT EXISTS public.role_hierarchy (
  role public.user_role NOT NULL,
  level public.role_level NOT NULL,
  can_manage public.user_role[] NOT NULL,
  PRIMARY KEY (role)
);

-- Insert role hierarchy data
INSERT INTO public.role_hierarchy (role, level, can_manage) VALUES
  ('administrator', '1_administrator', ARRAY['teacher', 'teaching_assistant', 'learner']::public.user_role[]),
  ('teacher', '2_teacher', ARRAY['teaching_assistant', 'learner']::public.user_role[]),
  ('teaching_assistant', '3_teaching_assistant', ARRAY['learner']::public.user_role[]),
  ('learner', '4_learner', ARRAY[]::public.user_role[]);

-- Add profile completion tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS completion_status jsonb DEFAULT '{
  "basic_info": false,
  "avatar": false,
  "preferences": false,
  "onboarding": false
}'::jsonb,
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{
  "email_notifications": true,
  "display_name_preference": "full_name"
}'::jsonb;

-- Add course improvements
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS course_type text CHECK (course_type IN ('standard', 'self_paced', 'workshop')) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{
  "allow_self_enrollment": false,
  "requires_approval": true,
  "show_progress": true
}'::jsonb;

-- Create course progression tracking
CREATE TABLE IF NOT EXISTS public.course_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id integer REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_modules jsonb DEFAULT '[]'::jsonb,
  last_accessed timestamp with time zone DEFAULT now(),
  progress_percentage integer DEFAULT 0,
  UNIQUE (user_id, course_id)
);

-- Add RLS policies
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can read own progress"
  ON public.course_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON public.course_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to check role hierarchy
CREATE OR REPLACE FUNCTION public.check_role_hierarchy(
  current_role public.user_role,
  target_role public.user_role
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.role_hierarchy
    WHERE role = current_role
    AND target_role = ANY(can_manage)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate role changes
CREATE OR REPLACE FUNCTION public.validate_role_change()
RETURNS trigger AS $$
BEGIN
  -- Check if user has permission to change roles
  IF NOT (
    SELECT check_role_hierarchy(
      (SELECT role FROM public.profiles WHERE id = auth.uid()),
      NEW.role
    )
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to assign this role';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for role validation
CREATE TRIGGER validate_role_change_trigger
  BEFORE INSERT OR UPDATE OF role
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_change();