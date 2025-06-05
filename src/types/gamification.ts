
export interface League {
  id: number;
  name: string;
  min_points: number;
  max_points: number | null;
  color: string;
  icon: string;
  order_rank: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  type: string;
  points_reward: number;
  icon: string;
  color: string;
  requirement_value: number | null;
  is_repeatable: boolean;
}

export interface UserAchievement {
  id: string;
  achievement_id: number;
  earned_at: string;
  progress: number;
  is_completed: boolean;
  achievement?: Achievement;
}

export interface UserGamificationStats {
  id: string;
  user_id: string;
  total_points: number;
  current_league_id: number | null;
  current_streak: number;
  longest_streak: number;
  lessons_completed: number;
  courses_completed: number;
  last_activity_date: string | null;
  league?: League;
}

export interface CourseUserStats {
  id: string;
  user_id: string;
  course_id: number;
  points_earned: number;
  lessons_completed: number;
  perfect_scores: number;
  completion_percentage: number;
  last_activity: string;
}
