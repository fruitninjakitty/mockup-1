
import { useGamification } from '@/hooks/useGamification';
import { LeagueDisplay } from './LeagueDisplay';
import { AchievementCard } from './AchievementCard';
import { Leaderboard } from './Leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Calendar, BookOpen } from 'lucide-react';

export function GamificationDashboard() {
  const { stats, achievements, leagues, allAchievements, isLoading } = useGamification();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentLeague = stats?.league || null;
  const nextLeague = currentLeague ? leagues.find(l => l.order_rank === currentLeague.order_rank + 1) || null : null;
  const earnedAchievements = achievements.filter(a => a.is_completed);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.total_points.toLocaleString() || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.current_streak || 0}
                </p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.courses_completed || 0}
                </p>
                <p className="text-sm text-muted-foreground">Courses Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.longest_streak || 0}
                </p>
                <p className="text-sm text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* League Display */}
      <LeagueDisplay 
        currentLeague={currentLeague}
        nextLeague={nextLeague}
        currentPoints={stats?.total_points || 0}
      />

      {/* Tabs for different sections */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">
            Achievements {earnedAchievements.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {earnedAchievements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🏆 Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {earnedAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {earnedAchievements.map((userAchievement) => {
                    const achievement = allAchievements.find(a => a.id === userAchievement.achievement_id);
                    if (!achievement) return null;
                    return (
                      <AchievementCard
                        key={userAchievement.id}
                        achievement={achievement}
                        userAchievement={userAchievement}
                        isEarned={true}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Complete your first lesson to earn your first achievement! 🚀
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Available Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allAchievements
                  .filter(achievement => !earnedAchievements.some(ea => ea.achievement_id === achievement.id))
                  .map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isEarned={false}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
