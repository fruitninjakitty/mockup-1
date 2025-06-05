
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserGamificationStats, UserAchievement, League, Achievement } from '@/types/gamification';

export function useGamification() {
  const [stats, setStats] = useState<UserGamificationStats | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch user gamification stats with league info
      const { data: statsData, error: statsError } = await supabase
        .from('user_gamification_stats')
        .select(`
          *,
          league:leagues(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) throw statsError;

      if (statsData) {
        setStats(statsData);
      } else {
        // Create initial stats if they don't exist
        const { data: newStats, error: createError } = await supabase
          .from('user_gamification_stats')
          .insert([{ user_id: user.id }])
          .select(`
            *,
            league:leagues(*)
          `)
          .single();

        if (createError) throw createError;
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast({
        title: "Error",
        description: "Could not load your progress",
        variant: "destructive",
      });
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchLeagues = async () => {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('order_rank');

      if (error) throw error;
      setLeagues(data || []);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchAllAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points_reward');

      if (error) throw error;
      setAllAchievements(data || []);
    } catch (error) {
      console.error('Error fetching all achievements:', error);
    }
  };

  const awardPoints = async (points: number, achievementType?: string, value?: number) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_points: points,
        p_achievement_type: achievementType || null,
        p_value: value || null
      });

      if (error) throw error;

      // Refresh stats and achievements
      await fetchUserStats();
      await fetchUserAchievements();

      return true;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchUserStats(),
        fetchUserAchievements(),
        fetchLeagues(),
        fetchAllAchievements()
      ]);
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    stats,
    achievements,
    leagues,
    allAchievements,
    isLoading,
    awardPoints,
    refreshStats: fetchUserStats
  };
}
