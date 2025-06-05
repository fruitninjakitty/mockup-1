
import { Trophy, Crown, Shield, Gem, Diamond, Star } from 'lucide-react';
import { League } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LeagueDisplayProps {
  currentLeague: League | null;
  nextLeague: League | null;
  currentPoints: number;
  className?: string;
}

const getLeagueIcon = (iconName: string) => {
  switch (iconName) {
    case 'crown': return Crown;
    case 'shield': return Shield;
    case 'gem': return Gem;
    case 'diamond': return Diamond;
    case 'star': return Star;
    case 'trophy': return Trophy;
    default: return Shield;
  }
};

export function LeagueDisplay({ currentLeague, nextLeague, currentPoints, className }: LeagueDisplayProps) {
  if (!currentLeague) return null;

  const Icon = getLeagueIcon(currentLeague.icon);
  const pointsInCurrentLeague = currentPoints - currentLeague.min_points;
  const pointsNeededForNext = nextLeague ? nextLeague.min_points - currentPoints : 0;
  const totalPointsInLeague = nextLeague ? nextLeague.min_points - currentLeague.min_points : 1000;
  const progressPercentage = Math.min((pointsInCurrentLeague / totalPointsInLeague) * 100, 100);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: currentLeague.color }}
          >
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: currentLeague.color }}>
              {currentLeague.name} League
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentPoints.toLocaleString()} points
            </p>
          </div>
        </div>

        {nextLeague && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextLeague.name}</span>
              <span>{pointsNeededForNext} points to go</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {!nextLeague && (
          <div className="text-center text-gold-500 font-semibold">
            🏆 Champion League - Maximum Rank! 🏆
          </div>
        )}
      </CardContent>
    </Card>
  );
}
