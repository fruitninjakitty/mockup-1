
import { GamificationDashboard } from '@/components/gamification/GamificationDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfileGamification() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎮 Your Gaming Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GamificationDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
