export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number;
          user_id: string;
          display_name: string | null;
          bio: string | null;
          avatar: string | null;
          level: number;
          xp: number;
          coins: number;
          energy: number;
          max_energy: number;
          current_streak: number;
          longest_streak: number;
          last_login_date: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          bio?: string | null;
          avatar?: string | null;
          level?: number;
          xp?: number;
          coins?: number;
          energy?: number;
          max_energy?: number;
          current_streak?: number;
          longest_streak?: number;
          last_login_date?: string | null;
          role?: 'user' | 'admin';
        };
        Update: {
          display_name?: string | null;
          bio?: string | null;
          avatar?: string | null;
          level?: number;
          xp?: number;
          coins?: number;
          energy?: number;
          max_energy?: number;
          current_streak?: number;
          longest_streak?: number;
          last_login_date?: string | null;
          role?: 'user' | 'admin';
          updated_at?: string;
        };
      };
      course_progress: {
        Row: {
          id: number;
          user_id: string;
          course_id: number;
          completed_lessons: string[];
          completed_quizzes: string[];
          overall_progress: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          course_id: number;
          completed_lessons?: string[];
          completed_quizzes?: string[];
          overall_progress?: number;
        };
        Update: {
          completed_lessons?: string[];
          completed_quizzes?: string[];
          overall_progress?: number;
          updated_at?: string;
        };
      };
      challenge_submissions: {
        Row: {
          id: number;
          user_id: string;
          challenge_id: number;
          status: string;
          source_code: string | null;
          language: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          challenge_id: number;
          status?: string;
          source_code?: string;
          language?: string;
        };
        Update: {
          status?: string;
          source_code?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          icon: string;
          color: string;
          requirement_type: string;
          requirement_count: number;
          xp_reward: number;
          coin_reward: number;
          is_secret: boolean;
        };
      };
      user_achievements: {
        Row: {
          id: number;
          user_id: string;
          achievement_id: string;
          completed: boolean;
          completed_at: string | null;
          progress: number;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
          completed?: boolean;
          completed_at?: string | null;
          progress?: number;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          progress?: number;
        };
      };
      leaderboard_entries: {
        Row: {
          id: number;
          user_id: string;
          display_name: string;
          level: number;
          xp: number;
          current_streak: number;
          challenges_solved: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          level?: number;
          xp?: number;
          current_streak?: number;
          challenges_solved?: number;
        };
        Update: {
          display_name?: string;
          level?: number;
          xp?: number;
          current_streak?: number;
          challenges_solved?: number;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: number;
          user_id: string;
          activity_type: string;
          description: string;
          xp_earned: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          activity_type: string;
          description: string;
          xp_earned?: number;
        };
      };
      chat_messages: {
        Row: {
          id: number;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
        };
      };
    };
  };
}
