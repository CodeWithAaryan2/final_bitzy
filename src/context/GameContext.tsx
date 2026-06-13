import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { getLevelFromXP } from './xpUtils';
import { achievements as achievementsData } from '@/data/achievements';
import type { XPPopup } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CourseProgress {
  course_id: number;
  completed_lessons: string[];
  completed_quizzes: string[];
  overall_progress: number;
}

interface UserAchievement {
  achievement_id: string;
  completed: boolean;
  completed_at: string | null;
  progress: number;
}

interface ChallengeSubmission {
  challenge_id: number;
  status: string;
}

interface GameState {
  courseProgress: CourseProgress[];
  achievements: UserAchievement[];
  submissions: ChallengeSubmission[];
}

interface GameContextType {
  gameState: GameState;
  isLoading: boolean;
  xpPopups: XPPopup[];
  showXPPopup: (amount: number, type: XPPopup['type'], message: string) => void;
  dismissPopup: (id: string) => void;
  addXP: (amount: number, source: string) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  spendEnergy: (amount: number) => Promise<boolean>;
  completeLesson: (courseId: number, lessonId: string, totalLessonsInCourse?: number) => Promise<void>;
  completeQuiz: (courseId: number, quizId: string, score: number) => Promise<void>;
  completeChallenge: (challengeId: number | string, accepted: boolean) => Promise<void>;
  hasCompletedLesson: (courseId: number, lessonId: string) => boolean;
  hasCompletedQuiz: (courseId: number, quizId: string) => boolean;
  hasCompletedChallenge: (challengeId: number | string) => boolean;
  getCourseProgress: (courseId: number) => CourseProgress | undefined;
  refreshGameState: () => Promise<void>;
  logActivity: (_type: string, description: string, _xpEarned: number) => Promise<void>;
}

const GameContext = createContext<GameContextType>({
  gameState: { courseProgress: [], achievements: [], submissions: [] },
  isLoading: true,
  xpPopups: [],
  showXPPopup: () => {},
  dismissPopup: () => {},
  addXP: async () => {},
  addCoins: async () => {},
  spendEnergy: async () => false,
  completeLesson: async () => {},
  completeQuiz: async () => {},
  completeChallenge: async () => {},
  hasCompletedLesson: () => false,
  hasCompletedQuiz: () => false,
  hasCompletedChallenge: () => false,
  getCourseProgress: () => undefined,
  refreshGameState: async () => {},
  logActivity: async () => {},
});

// Helper to get typed table reference
const tbl = (name: string) => supabase.from(name) as any;

export function GameProvider({ children }: { children: ReactNode }) {
  const { user, refreshProfile } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    courseProgress: [],
    achievements: [],
    submissions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [xpPopups, setXpPopups] = useState<XPPopup[]>([]);

  // Fetch all game state from Supabase
  const fetchGameState = useCallback(async () => {
    if (!user) {
      setGameState({ courseProgress: [], achievements: [], submissions: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [progressRes, achievementsRes, submissionsRes] = await Promise.all([
        tbl('course_progress').select('*').eq('user_id', user.id),
        tbl('user_achievements').select('*').eq('user_id', user.id),
        tbl('challenge_submissions').select('*').eq('user_id', user.id),
      ]);

      setGameState({
        courseProgress: (progressRes.data || []).map((p: any) => ({
          course_id: p.course_id,
          completed_lessons: p.completed_lessons || [],
          completed_quizzes: p.completed_quizzes || [],
          overall_progress: p.overall_progress || 0,
        })),
        achievements: (achievementsRes.data || []).map((a: any) => ({
          achievement_id: a.achievement_id,
          completed: a.completed,
          completed_at: a.completed_at,
          progress: a.progress || 0,
        })),
        submissions: (submissionsRes.data || []).map((s: any) => ({
          challenge_id: s.challenge_id,
          status: s.status,
        })),
      });
    } catch (e) {
      console.error('Error fetching game state:', e);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  const showXPPopup = (amount: number, type: XPPopup['type'], message: string) => {
    const popup: XPPopup = {
      id: Date.now().toString() + Math.random(),
      amount,
      type,
      message,
    };
    setXpPopups((prev) => [...prev, popup]);
    setTimeout(() => {
      setXpPopups((prev) => prev.filter((p) => p.id !== popup.id));
    }, 4000);
  };

  const dismissPopup = (id: string) => {
    setXpPopups((prev) => prev.filter((p) => p.id !== id));
  };

  // Read current profile value from DB to avoid stale closure issues
  const getProfileData = async (): Promise<{ xp: number; coins: number; energy: number; level: number } | null> => {
    if (!user) return null;
    try {
      const { data } = await tbl('profiles').select('xp,coins,energy,level').eq('user_id', user.id).single();
      return data as any;
    } catch {
      return null;
    }
  };

  // Safe DB update that always works
  const safeUpdateProfile = async (updates: Record<string, any>) => {
    if (!user) return false;
    try {
      const { error } = await tbl('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      if (error) {
        console.error('Profile update error:', error);
        return false;
      }
      await refreshProfile();
      return true;
    } catch (e) {
      console.error('Profile update exception:', e);
      return false;
    }
  };

  const addXP = async (amount: number, source: string) => {
    if (!user) return;
    try {
      const current = await getProfileData();
      if (!current) { console.warn('[addXP] no profile data'); return; }
      const newXP = (current.xp || 0) + amount;

      const { level } = getLevelFromXP(newXP);
      console.log(`[addXP] +${amount} from ${source}: ${current.xp} -> ${newXP} XP, level ${current.level} -> ${level}`);
      const ok = await safeUpdateProfile({ xp: newXP, level });
      if (!ok) console.error('[addXP] safeUpdateProfile FAILED');
      // Fire-and-forget activity log
      try {
        await tbl('activity_logs').insert({
          user_id: user.id, activity_type: 'xp', description: `+${amount} XP from ${source}`, xp_earned: amount,
        });
      } catch { /* ignore */ }
    } catch (e) {
      console.error('addXP error:', e);
    }
  };

  const addCoins = async (amount: number) => {
    if (!user) return;
    try {
      const current = await getProfileData();
      if (!current) return;
      await safeUpdateProfile({ coins: (current.coins || 0) + amount });
    } catch (e) {
      console.error('addCoins error:', e);
    }
  };

  // Never blocks the user — energy is cosmetic/pacing only.
  // Always returns true so lesson/quiz/challenge completion can never be stuck.
  const spendEnergy = async (amount: number): Promise<boolean> => {
    if (!user) return true;
    try {
      const current = await getProfileData();
      if (!current) return true;

      let energy = current.energy ?? 5;
      if (energy < amount) energy = 5; // auto-refill to default max
      const newEnergy = Math.max(0, energy - amount);
      await safeUpdateProfile({ energy: newEnergy });
    } catch (e) {
      console.error('spendEnergy error (non-blocking):', e);
    }
    return true;
  };

  // Maps numeric course_id (DB) -> course slug (used in achievement metadata)
  const COURSE_ID_TO_SLUG: Record<number, string> = {
    1: 'html-basics', 2: 'css-fundamentals', 3: 'javascript-basics',
    4: 'react-basics', 5: 'python-basics', 6: 'typescript-basics',
    7: 'nodejs-basics', 8: 'sql-basics', 9: 'git-github', 10: 'data-structures',
  };

  const checkAchievements = async () => {
    if (!user) return;
    try {
      const { data: profileData } = await tbl('profiles').select('xp,level,current_streak,coins').eq('user_id', user.id).single();
      const { data: progressData } = await tbl('course_progress').select('*').eq('user_id', user.id);
      const { data: submissionsData } = await tbl('challenge_submissions').select('*').eq('user_id', user.id);
      const { data: existingAchs } = await tbl('user_achievements').select('*').eq('user_id', user.id);

      const totalLessons = (progressData || []).reduce((sum: number, p: any) => sum + (p.completed_lessons?.length || 0), 0);
      const totalQuizzes = (progressData || []).reduce((sum: number, p: any) => sum + (p.completed_quizzes?.length || 0), 0);
      const totalChallenges = (submissionsData || []).filter((s: any) => s.status === 'accepted').length;
      const streak = (profileData as any)?.current_streak || 0;
      const coins = (profileData as any)?.coins || 0;
      const completedCourseSlugs = new Set(
        (progressData || [])
          .filter((p: any) => (p.overall_progress || 0) >= 100)
          .map((p: any) => COURSE_ID_TO_SLUG[p.course_id])
          .filter(Boolean)
      );

      // IDs must match src/data/achievements.ts exactly (DB FK enforces this)
      const achChecks = [
        { id: 'first-steps', condition: totalLessons >= 1 },
        { id: 'getting-warm', condition: totalLessons >= 5 },
        { id: 'lesson-learner', condition: totalLessons >= 25 },
        { id: 'quiz-whiz', condition: totalQuizzes >= 1 },
        { id: 'course-starter', condition: (progressData || []).length >= 1 },
        { id: 'course-finisher', condition: completedCourseSlugs.size >= 1 },
        { id: 'hello-world', condition: totalChallenges >= 1 },
        { id: 'bug-hunter', condition: totalChallenges >= 5 },
        { id: 'code-newbie', condition: totalChallenges >= 10 },
        { id: 'first-day', condition: streak >= 1 },
        { id: 'three-day-streak', condition: streak >= 3 },
        { id: 'week-warrior', condition: streak >= 7 },
        { id: 'monthly-master', condition: streak >= 30 },
        { id: 'unstoppable', condition: streak >= 100 },
        { id: 'rich', condition: coins >= 1000 },
        { id: 'html-rookie', condition: completedCourseSlugs.has('html-basics') },
        { id: 'css-artist', condition: completedCourseSlugs.has('css-fundamentals') },
        { id: 'js-ninja', condition: completedCourseSlugs.has('javascript-basics') },
        { id: 'react-champion', condition: completedCourseSlugs.has('react-basics') },
        { id: 'python-wizard', condition: completedCourseSlugs.has('python-basics') },
      ];

      const existingMap = new Map((existingAchs || []).map((a: any) => [a.achievement_id, a]));
      const newlyUnlocked: string[] = [];

      for (const ach of achChecks) {
        const existing = existingMap.get(ach.id) as any;
        if (existing?.completed) continue; // already unlocked

        if (ach.condition) {
          const { error } = await tbl('user_achievements').upsert({
            user_id: user.id, achievement_id: ach.id, completed: true,
            completed_at: new Date().toISOString(), progress: 100,
          }, { onConflict: 'user_id,achievement_id' });
          if (!error) newlyUnlocked.push(ach.id);
          else console.error(`Achievement upsert failed for ${ach.id}:`, error.message);
        } else if (!existing) {
          // Track progress for not-yet-unlocked achievements (optional, ignore errors)
          await tbl('user_achievements').upsert({
            user_id: user.id, achievement_id: ach.id, completed: false, progress: 0,
          }, { onConflict: 'user_id,achievement_id' }).then(() => {}, () => {});
        }
      }

      // Show popup for newly unlocked badges
      for (const id of newlyUnlocked) {
        const meta = achievementsData.find(a => a.id === id);
        if (meta) {
          showXPPopup(meta.xpReward, 'xp', `🏆 Badge unlocked: ${meta.title}!`);
        }
      }
    } catch (e) {
      console.error('checkAchievements error:', e);
    }
  };

  const completeLesson = async (courseId: number, lessonId: string, totalLessonsInCourse?: number) => {
    if (!user) { console.warn('[completeLesson] No user — aborting'); return; }
    try {
      const total = totalLessonsInCourse || 20;
      console.log('[completeLesson] user=', user.id, 'courseId=', courseId, 'lessonId=', lessonId, 'total=', total);

      const { data: existingRow, error: fetchErr } = await tbl('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (fetchErr) console.error('[completeLesson] fetch existing error:', fetchErr.message);
      console.log('[completeLesson] existingRow=', existingRow);

      let lessons: string[] = existingRow?.completed_lessons || [];
      if (!lessons.includes(lessonId)) lessons = [...lessons, lessonId];
      const progress = Math.min(100, Math.round((lessons.length / total) * 100));
      console.log('[completeLesson] new lessons=', lessons, 'progress=', progress);

      const { data: upsertData, error: upsertErr } = await tbl('course_progress').upsert({
        user_id: user.id,
        course_id: courseId,
        completed_lessons: lessons,
        completed_quizzes: existingRow?.completed_quizzes || [],
        overall_progress: progress,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' }).select();

      if (upsertErr) {
        console.error('[completeLesson] UPSERT FAILED:', upsertErr.message, upsertErr.code, upsertErr.details);
        return;
      }
      console.log('[completeLesson] upsert success:', upsertData);

      await addXP(25, 'lesson');
      await addCoins(10);
      await checkAchievements();
      await fetchGameState();
      console.log('[completeLesson] DONE — gameState refreshed');
      showXPPopup(25, 'xp', '+25 XP! Lesson complete! 🎉');
      showXPPopup(10, 'coin', '+10 gems! 💎');
    } catch (e) {
      console.error('[completeLesson] EXCEPTION:', e);
    }
  };

  const completeQuiz = async (courseId: number, quizId: string, score: number) => {
    if (!user) return;
    try {
      const { data: existingRow } = await tbl('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      let quizzes: string[] = existingRow?.completed_quizzes || [];
      if (!quizzes.includes(quizId)) quizzes = [...quizzes, quizId];

      const { error: upsertErr } = await tbl('course_progress').upsert({
        user_id: user.id,
        course_id: courseId,
        completed_lessons: existingRow?.completed_lessons || [],
        completed_quizzes: quizzes,
        overall_progress: existingRow?.overall_progress || 5,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' });

      if (upsertErr) {
        console.error('completeQuiz upsert error:', upsertErr.message);
        return;
      }

      const xpGain = score >= 100 ? 50 : Math.round(score / 2);
      await addXP(xpGain, 'quiz');
      await addCoins(15);
      await checkAchievements();
      await fetchGameState();
      showXPPopup(xpGain, 'xp', `+${xpGain} XP! Quiz done! 🎯`);
      showXPPopup(15, 'coin', '+15 gems! 💎');
    } catch (e) {
      console.error('completeQuiz error:', e);
    }
  };

  const completeChallenge = async (challengeId: number | string, accepted: boolean) => {
    if (!user) return;
    try {
      await tbl('challenge_submissions').upsert({
        user_id: user.id, challenge_id: challengeId,
        status: accepted ? 'accepted' : 'attempted',
      }, { onConflict: 'user_id,challenge_id' });

      if (accepted) {
        const current = await getProfileData();
        if (!current) return;

        const newXP = (current.xp || 0) + 75;
        const newCoins = (current.coins || 0) + 30;

        const { level } = getLevelFromXP(newXP);
        await safeUpdateProfile({ xp: newXP, coins: newCoins, level });
      }

      await checkAchievements();
      await fetchGameState();
    } catch (e) {
      console.error('completeChallenge error:', e);
    }
  };

  const hasCompletedLesson = (courseId: number | string, lessonId: string): boolean => {
    const progress = gameState.courseProgress.find((p) => String(p.course_id) === String(courseId));
    return progress?.completed_lessons?.includes(lessonId) ?? false;
  };

  const hasCompletedQuiz = (courseId: number | string, quizId: string): boolean => {
    const progress = gameState.courseProgress.find((p) => String(p.course_id) === String(courseId));
    return progress?.completed_quizzes?.includes(quizId) ?? false;
  };

  const hasCompletedChallenge = (challengeId: number | string): boolean => {
    const sub = gameState.submissions.find((s) => String(s.challenge_id) === String(challengeId));
    return sub?.status === 'accepted';
  };

  const getCourseProgress = (courseId: number | string): CourseProgress | undefined => {
    return gameState.courseProgress.find((p) => String(p.course_id) === String(courseId));
  };

  const refreshGameState = async () => {
    await fetchGameState();
  };

  const logActivity = async (_type: string, description: string, _xpEarned: number) => {
    if (!user) return;
    try {
      await tbl('activity_logs').insert({
        user_id: user.id, activity_type: _type, description, xp_earned: _xpEarned,
      });
    } catch {
      // Silently fail - activity logs are not critical
    }
  };

  return (
    <GameContext.Provider value={{
      gameState, isLoading, xpPopups, showXPPopup, dismissPopup,
      addXP, addCoins, spendEnergy, completeLesson, completeQuiz, completeChallenge,
      hasCompletedLesson, hasCompletedQuiz, hasCompletedChallenge, getCourseProgress,
      refreshGameState, logActivity,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
