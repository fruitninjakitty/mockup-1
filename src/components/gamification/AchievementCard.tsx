
import { Award, Star, Trophy, Medal } from 'lucide-react';
import { Achievement, UserAchievement } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  isEarned?: boolean;
  className?: string;
}

const getAchievementIcon = (iconName: string) => {
  switch (iconName) {
    case 'award': return Award;
    case 'star': return Star;
    case 'trophy': return Trophy;
    case 'medal': return Medal;
    default: return Award;
  }
};

export function AchievementCard({ achievement, userAchievement, isEarned = false, className }: AchievementCardProps) {
  const Icon = getAchievementIcon(achievement.icon);

  return (
    <Card className={`transition-all duration-200 ${isEarned ? 'border-yellow-500 bg-yellow-50' : 'opacity-60'} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
              isEarned ? 'animate-pulse' : ''
            }`}
            style={{ backgroundColor: isEarned ? achievement.color : '#9CA3AF' }}
          >
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold ${isEarned ? 'text-yellow-700' : 'text-gray-500'}`}>
                {achievement.name}
              </h4>
              <Badge variant={isEarned ? 'default' : 'secondary'} className="text-xs">
                +{achievement.points_reward}
              </Badge>
            </div>
            
            <p className={`text-sm ${isEarned ? 'text-yellow-600' : 'text-gray-400'}`}>
              {achievement.description}
            </p>
            
            {isEarned && userAchievement && (
              <p className="text-xs text-green-600 font-medium">
                Earned {new Date(userAchievement.earned_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
