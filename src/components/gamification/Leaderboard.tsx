
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { UserGamificationStats } from '@/types/gamification';

interface LeaderboardEntry extends UserGamificationStats {
  profile?: {
    full_name: string;
    avatar_url?: string;
  } | null;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_gamification_stats')
        .select(`
          *,
          league:leagues(*),
          profile:profiles(full_name, avatar_url)
        `)
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Type-safe data handling
      const typedData: LeaderboardEntry[] = (data || []).map(entry => {
        const profileData = entry.profile;
        
        // Check if profileData exists and has the required structure
        const hasValidProfile = profileData && 
                               typeof profileData === 'object' && 
                               'full_name' in profileData;
        
        return {
          ...entry,
          profile: hasValidProfile 
            ? profileData as { full_name: string; avatar_url?: string }
            : null
        };
      });
      
      setLeaderboard(typedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏆 Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {entry.profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {entry.profile?.full_name || 'Anonymous User'}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{entry.total_points.toLocaleString()} points</span>
                  {entry.league && (
                    <span 
                      className="px-2 py-1 rounded text-white font-medium"
                      style={{ backgroundColor: entry.league.color }}
                    >
                      {entry.league.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
