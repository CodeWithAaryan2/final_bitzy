import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Zap, Star, BookOpen, Swords, Award, Settings, Target } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { achievements } from '@/data/achievements';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, isLoading } = useAuth();
  const { gameState } = useGame();

  if (isLoading || !profile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedAchs = (gameState.achievements || []).filter((a) => a.completed).length;
  const solvedChallenges = gameState.submissions.filter((s) => s.status === 'accepted').length;
  const displayName = profile?.display_name ?? 'Learner';
  const avatar = profile?.avatar;

  const stats = [
    { label: 'Level', value: profile?.level ?? 1, icon: Star, color: '#FFC800', bg: '#FFF8E0' },
    { label: 'XP', value: profile?.xp ?? 0, icon: Zap, color: '#FFC800', bg: '#FFF8E0' },
    { label: 'Coins', value: profile?.coins ?? 0, icon: Zap, color: '#1CB0F6', bg: '#E5F6FF' },
    { label: 'Streak', value: profile?.current_streak ?? 0, icon: Flame, color: '#FF9600', bg: '#FFF3E0' },
  ];

  const courseProgress = gameState.courseProgress || [];
  const activityStats = [
    { label: 'Lessons Done', value: courseProgress.reduce((s, c) => s + (c.completed_lessons || []).length, 0), icon: BookOpen, color: '#58CC02' },
    { label: 'Challenges', value: solvedChallenges, icon: Swords, color: '#1CB0F6' },
    { label: 'Achievements', value: completedAchs, icon: Award, color: '#CE82FF' },
    { label: 'Quizzes', value: courseProgress.reduce((s, c) => s + (c.completed_quizzes || []).length, 0), icon: Target, color: '#FF4B4B' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item} className="text-center">
        <motion.div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #58CC02, #89E219)' }} whileHover={{ scale: 1.05 }}>
          {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover rounded-full" /> : displayName[0]?.toUpperCase() || 'U'}
        </motion.div>
        <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>{displayName}</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile?.bio || 'Learning to code!'}</p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2" style={{ backgroundColor: '#F0FFE5', borderColor: '#D4EDBC' }}>
          <Star className="w-4 h-4" style={{ color: '#FFC800' }} />
          <span className="text-sm font-bold" style={{ color: '#58CC02' }}>Level {profile?.level ?? 1}</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: s.bg }}>
            <s.icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
            <p className="font-display text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="d-card p-4 space-y-3">
        <h2 className="font-display text-lg font-bold">Activity</h2>
        <div className="grid grid-cols-2 gap-3">
          {activityStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{stat.value}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold">Badges</h2>
          <button onClick={() => navigate('/app/achievements')} className="text-xs font-bold" style={{ color: '#1CB0F6' }}>View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {(gameState.achievements || []).filter((a) => a.completed).slice(0, 5).map((ua) => {
            const ach = achievements.find((a) => a.id === ua.achievement_id);
            if (!ach) return null;
            return (
              <motion.div key={ach.id} whileTap={{ scale: 0.9 }} onClick={() => navigate('/app/achievements')}
                className="flex-shrink-0 w-16 flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: ach.color + '15' }}>
                  <Award className="w-6 h-6" style={{ color: ach.color }} />
                </div>
                <p className="text-[10px] font-bold text-center leading-tight" style={{ color: 'var(--text-light)' }}>{ach.title}</p>
              </motion.div>
            );
          })}
          {completedAchs === 0 && (
            <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>Complete lessons and challenges to earn badges!</p>
          )}
        </div>
      </motion.div>

      <motion.button variants={item} whileTap={{ scale: 0.98 }} onClick={() => navigate('/app/settings')}
        className="w-full d-card p-4 flex items-center gap-3 text-left group cursor-pointer">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
          <Settings className="w-5 h-5" style={{ color: 'var(--text-light)' }} />
        </div>
        <div className="flex-1">
          <p className="font-bold" style={{ color: 'var(--text)' }}>Settings</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage your account</p>
        </div>
      </motion.button>

      <div className="h-4" />
    </motion.div>
  );
}
