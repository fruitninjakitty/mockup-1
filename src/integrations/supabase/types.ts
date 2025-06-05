export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          color: string
          created_at: string | null
          description: string
          icon: string
          id: number
          is_repeatable: boolean | null
          name: string
          points_reward: number
          requirement_value: number | null
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Insert: {
          color?: string
          created_at?: string | null
          description: string
          icon: string
          id?: number
          is_repeatable?: boolean | null
          name: string
          points_reward?: number
          requirement_value?: number | null
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: number
          is_repeatable?: boolean | null
          name?: string
          points_reward?: number
          requirement_value?: number | null
          type?: Database["public"]["Enums"]["achievement_type"]
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          id: string
          notes: string | null
          organization_id: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          organization_id?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          organization_id?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          course_id: number
          created_at: string
          created_by: string | null
          description: string
          due_date: string | null
          id: number
          title: string
        }
        Insert: {
          course_id: number
          created_at?: string
          created_by?: string | null
          description: string
          due_date?: string | null
          id?: number
          title: string
        }
        Update: {
          course_id?: number
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string | null
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_modules: Json | null
          course_id: number | null
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completed_modules?: Json | null
          course_id?: number | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completed_modules?: Json | null
          course_id?: number | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_user_stats: {
        Row: {
          completion_percentage: number | null
          course_id: number
          id: string
          last_activity: string | null
          lessons_completed: number | null
          perfect_scores: number | null
          points_earned: number | null
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          course_id: number
          id?: string
          last_activity?: string | null
          lessons_completed?: number | null
          perfect_scores?: number | null
          points_earned?: number | null
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          course_id?: number
          id?: string
          last_activity?: string | null
          lessons_completed?: number | null
          perfect_scores?: number | null
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_user_stats_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_type: string | null
          created_at: string
          created_by: string | null
          description: string
          id: number
          image: string
          settings: Json | null
          status: string | null
          title: string
        }
        Insert: {
          course_type?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: number
          image: string
          settings?: Json | null
          status?: string | null
          title: string
        }
        Update: {
          course_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: number
          image?: string
          settings?: Json | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      leagues: {
        Row: {
          color: string
          icon: string
          id: number
          max_points: number | null
          min_points: number
          name: string
          order_rank: number
        }
        Insert: {
          color: string
          icon: string
          id?: number
          max_points?: number | null
          min_points: number
          name: string
          order_rank: number
        }
        Update: {
          color?: string
          icon?: string
          id?: number
          max_points?: number | null
          min_points?: number
          name?: string
          order_rank?: number
        }
        Relationships: []
      }
      organizations: {
        Row: {
          code: string
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          completion_status: Json | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_approved: boolean
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          settings: Json | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          completion_status?: Json | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_approved?: boolean
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          completion_status?: Json | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_approved?: boolean
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_hierarchy: {
        Row: {
          can_manage: Database["public"]["Enums"]["user_role"][]
          level: Database["public"]["Enums"]["role_level"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          can_manage: Database["public"]["Enums"]["user_role"][]
          level: Database["public"]["Enums"]["role_level"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          can_manage?: Database["public"]["Enums"]["user_role"][]
          level?: Database["public"]["Enums"]["role_level"]
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          course_id: number
          id: number
          last_activity: string
          progress_percentage: number
          user_id: string
        }
        Insert: {
          course_id: number
          id?: number
          last_activity?: string
          progress_percentage?: number
          user_id: string
        }
        Update: {
          course_id?: number
          id?: number
          last_activity?: string
          progress_percentage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: number
          content: string
          feedback: string | null
          grade: number | null
          graded_at: string | null
          graded_by: string | null
          id: number
          student_id: string
          submitted_at: string
        }
        Insert: {
          assignment_id: number
          content: string
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: number
          student_id: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: number
          content?: string
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: number
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      ta_requests: {
        Row: {
          course_id: number
          created_at: string
          id: number
          status: Database["public"]["Enums"]["request_status"]
          ta_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          course_id: number
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["request_status"]
          ta_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          course_id?: number
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["request_status"]
          ta_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ta_requests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      teaching_requests: {
        Row: {
          course_id: number
          created_at: string
          id: number
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          course_id: number
          created_at?: string
          id?: number
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          course_id?: number
          created_at?: string
          id?: number
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teaching_requests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: number
          earned_at: string | null
          id: string
          is_completed: boolean | null
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: number
          earned_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: number
          earned_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification_stats: {
        Row: {
          courses_completed: number | null
          created_at: string | null
          current_league_id: number | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          lessons_completed: number | null
          longest_streak: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          courses_completed?: number | null
          created_at?: string | null
          current_league_id?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          lessons_completed?: number | null
          longest_streak?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          courses_completed?: number | null
          created_at?: string | null
          current_league_id?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          lessons_completed?: number | null
          longest_streak?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_stats_current_league_id_fkey"
            columns: ["current_league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      users_courses: {
        Row: {
          course_id: number
          enrolled_at: string
          id: number
          is_archived: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          course_id: number
          enrolled_at?: string
          id?: number
          is_archived?: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          course_id?: number
          enrolled_at?: string
          id?: number
          is_archived?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_role_to_user: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      award_points: {
        Args: {
          p_user_id: string
          p_points: number
          p_achievement_type?: Database["public"]["Enums"]["achievement_type"]
          p_value?: number
        }
        Returns: boolean
      }
      check_role_hierarchy: {
        Args: {
          checking_role: Database["public"]["Enums"]["user_role"]
          target_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_roles: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"][]
      }
      get_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_roles: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"][]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      remove_role_from_user: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      search_users: {
        Args: { search_query: string }
        Returns: {
          id: string
          full_name: string
          email: string
          role: Database["public"]["Enums"]["user_role"]
          bio: string
        }[]
      }
      user_belongs_to_organization: {
        Args: { org_id: string }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          user_id: string
          check_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      achievement_type:
        | "course_completion"
        | "lesson_streak"
        | "points_milestone"
        | "first_lesson"
        | "perfect_score"
        | "speed_learner"
        | "consistent_learner"
      request_status: "pending" | "accepted" | "rejected"
      role_level:
        | "1_administrator"
        | "2_teacher"
        | "3_teaching_assistant"
        | "4_learner"
      user_role: "teacher" | "teaching_assistant" | "learner" | "administrator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_type: [
        "course_completion",
        "lesson_streak",
        "points_milestone",
        "first_lesson",
        "perfect_score",
        "speed_learner",
        "consistent_learner",
      ],
      request_status: ["pending", "accepted", "rejected"],
      role_level: [
        "1_administrator",
        "2_teacher",
        "3_teaching_assistant",
        "4_learner",
      ],
      user_role: ["teacher", "teaching_assistant", "learner", "administrator"],
    },
  },
} as const
