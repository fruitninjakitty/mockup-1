
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
      
      // First try to get user metadata from auth session (doesn't trigger RLS)
      const initialProfile: UserProfile = {
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        bio: '',
        avatarUrl: '',
        userRoles: ['Learner'] // Default role
      };

      // Then try to fetch additional profile data from profiles table
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, bio, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData && !profileError) {
          const profile: ProfileData = profileData;
          
          initialProfile.fullName = profile.full_name || initialProfile.fullName;
          initialProfile.email = profile.email || initialProfile.email;
          initialProfile.bio = profile.bio || initialProfile.bio;
          initialProfile.avatarUrl = profile.avatar_url || initialProfile.avatarUrl;
        } else if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile data:", profileError);
        }
      } catch (profileFetchError) {
        console.error("Error in profile fetch:", profileFetchError);
      }

      // Then try to fetch user roles separately
      try {
        const { data: rolesData, error: rolesError } = await supabase
          .rpc('get_user_roles', { user_id: user.id });

        if (rolesData && !rolesError) {
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

          if (displayRoles.length > 0) {
            initialProfile.userRoles = displayRoles;
          }
        }
      } catch (rolesFetchError) {
        console.error("Error in roles fetch:", rolesFetchError);
      }

      setUserProfile(initialProfile);
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
