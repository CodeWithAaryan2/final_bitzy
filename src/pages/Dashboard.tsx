import { motion } from 'framer-motion';
import { Flame, Zap, Heart, Gem, Target, CheckCircle2, ChevronRight, Gamepad2, BookOpen, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getLevelFromXP } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { courses, getCourseNumericId } from '@/data/courses';

const W = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const I = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { gameState } = useGame();
  const levelInfo = getLevelFromXP(profile?.xp ?? 0);
  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const coins = profile?.coins ?? 0;
  const streak = profile?.current_streak ?? 0;
  const energy = profile?.energy ?? 0;

  const stats = [
    { label: 'XP', value: xp, icon: Zap, color: '#FFC800' },
    { label: 'Hearts', value: energy, icon: Heart, color: '#FF4B4B' },
    { label: 'Gems', value: coins, icon: Gem, color: '#1CB0F6' },
    { label: 'Streak', value: streak, icon: Flame, color: '#FF9600' },
  ];

  const quickActions = [
    { label: 'Courses', icon: BookOpen, color: '#58CC02', path: '/app/courses', desc: 'Continue learning' },
    { label: 'Play', icon: Gamepad2, color: '#CE82FF', path: '/app/games', desc: 'Practice with games' },
    { label: 'Arena', icon: Swords, color: '#FF4B4B', path: '/app/challenges', desc: 'Solve challenges' },
  ];

  return (
    <motion.div variants={W} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={I} className="flex items-center gap-4">
        <motion.img src="/mascot.png" alt="" className="w-14 h-14 object-contain flex-shrink-0" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        <div>
          <h1 className="font-display text-2xl font-bold">Welcome back!</h1>
          <div className="flex items-center gap-2">
            <div className="d-progress w-32 h-2.5">
              <div className="d-progress-fill" style={{ width: `${Math.round((levelInfo.currentLevelXP / (levelInfo.currentLevelXP + levelInfo.xpToNext)) * 100)}%` }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#58CC02' }}>Lv.{level}</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={I} className="flex gap-2">
        {stats.map((s) => (
          <div key={s.label} className="d-card flex-1 flex items-center gap-1.5 px-3 py-2">
            <s.icon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
            <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[10px] font-bold hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={I} className="grid grid-cols-3 gap-3">
        {quickActions.map((a) => (
          <motion.button key={a.label} whileTap={{ scale: 0.95 }} onClick={() => navigate(a.path)}
            className="d-card p-4 text-center" style={{ borderLeftWidth: '4px', borderLeftColor: a.color }}>
            <div className="w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: a.color + '15' }}>
              <a.icon className="w-5 h-5" style={{ color: a.color }} />
            </div>
            <p className="text-xs font-bold">{a.label}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
          </motion.button>
        ))}
      </motion.div>

      <motion.div variants={I}>
        <h2 className="font-display text-lg font-bold mb-3">Your Courses</h2>
        <div className="space-y-3">
          {courses.slice(0, 5).map((course) => {
            const cp = gameState.courseProgress.find((p) => String(p.course_id) === String(getCourseNumericId(course.id)));
            const progress = cp?.overall_progress ?? 0;
            return (
              <motion.div key={course.id} whileTap={{ scale: 0.98 }} onClick={() => navigate(`/app/courses/${course.slug}`)}
                className="d-card p-3 flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-lg font-bold flex-shrink-0 text-white" style={{ backgroundColor: course.color }}>
                  {course.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="d-progress flex-1 h-2">
                      <div className="d-progress-fill" style={{ width: `${progress}%`, backgroundColor: course.color }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{progress}%</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={I} className="d-card p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#2B7FFF' }}>
          <Target className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold" style={{ color: 'var(--text)' }}>Daily Goal</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Complete 3 lessons today</p>
          <div className="flex gap-2 mt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: i < 1 ? '#F0FFE5' : 'var(--surface)', border: `2px solid ${i < 1 ? '#58CC02' : 'var(--border)'}` }}>
                {i < 1 ? <CheckCircle2 className="w-4 h-4" style={{ color: '#58CC02' }} /> : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="h-4" />
    </motion.div>
  );
}
