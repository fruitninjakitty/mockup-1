
import { useEffect, useState } from 'react';
import { Achievement } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Medal } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
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

export function AchievementToast({ achievement, isVisible, onClose }: AchievementToastProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const Icon = getAchievementIcon(achievement.icon);

  useEffect(() => {
    if (isVisible) {
      setShouldShow(true);
      const timer = setTimeout(() => {
        setShouldShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      shouldShow ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
    }`}>
      <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg animate-bounce">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white animate-pulse"
              style={{ backgroundColor: achievement.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-yellow-700">🎉 Achievement Unlocked!</h4>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  +{achievement.points_reward}
                </Badge>
              </div>
              <p className="font-semibold text-yellow-800">{achievement.name}</p>
              <p className="text-sm text-yellow-600">{achievement.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
