
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/components/profile/types';
import { useToast } from './use-toast';

interface ProfileData {
  full_name?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
}

export function useProfileData() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    bio: '',
    avatarUrl: '',
    userRoles: []
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // First fetch the basic profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile data:", profileError);
        toast({
          title: "Error",
          description: "Could not load your profile data",
          variant: "destructive",
        });
        return;
      }

      // Then fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .rpc('get_user_roles', { user_id: user.id });

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
      }

      // Convert database roles to display roles
      const displayRoles = (rolesData || []).map(role => {
        switch(role) {
          case 'administrator': return 'Administrator';
          case 'teacher': return 'Teacher';
          case 'teaching_assistant': return 'Teaching Assistant';
          case 'learner': 
          default: return 'Learner';
        }
      });

      // Get values from profile or fallback to sensible defaults
      const profile: ProfileData = profileData || {};

      setUserProfile({
        fullName: profile.full_name || user.user_metadata?.full_name || '',
        email: profile.email || user.email || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url || '',
        userRoles: displayRoles.length > 0 ? displayRoles : ['Learner']
      });
      
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      toast({
        title: "Error",
        description: "Could not load profile information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return {
    userProfile,
    setUserProfile: updateUserProfile,
    isProfileOpen,
    setIsProfileOpen,
    isLoading,
    fetchUserProfile
  };
}
