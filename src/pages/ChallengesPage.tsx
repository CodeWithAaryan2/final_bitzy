import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Star, Zap, Trophy, TrendingUp } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { challenges } from '@/data/challenges';
import { getChallengeNumericId } from '@/data/challenges';
import { useState } from 'react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const difficultyConfig: Record<string, { color: string; bg: string; label: string }> = {
  Easy: { color: '#58CC02', bg: '#F0FFE5', label: 'Easy' },
  Medium: { color: '#FF9600', bg: '#FFF3E0', label: 'Medium' },
  Hard: { color: '#FF4B4B', bg: '#FFE8E8', label: 'Hard' },
};

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { hasCompletedChallenge } = useGame();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Easy', 'Medium', 'Hard'];
  const filtered = filter === 'All' ? challenges : challenges.filter(c => c.difficulty === filter);
  const solvedCount = challenges.filter(c => hasCompletedChallenge(getChallengeNumericId(c.id))).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#1CB0F6' }}>
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Code Arena</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Battle coding challenges</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="d-card p-3 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color: '#FF9600' }} />
          <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{solvedCount}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Solved</p>
        </div>
        <div className="d-card p-3 text-center">
          <Zap className="w-6 h-6 mx-auto mb-1" style={{ color: '#FFC800' }} />
          <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{challenges.length - solvedCount}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Pending</p>
        </div>
        <div className="d-card p-3 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-1" style={{ color: '#58CC02' }} />
          <p className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{Math.round((solvedCount / challenges.length) * 100)}%</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Progress</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all"
            style={{
              borderColor: filter === c ? '#58CC02' : 'var(--border)',
              backgroundColor: filter === c ? '#58CC02' : 'var(--white)',
              color: filter === c ? 'white' : 'var(--text-light)',
            }}>
            {c}
          </button>
        ))}
      </motion.div>

      <div className="space-y-3">
        {filtered.map((challenge, idx) => {
          const solved = hasCompletedChallenge(getChallengeNumericId(challenge.id));
          const diff = difficultyConfig[challenge.difficulty];

          return (
            <motion.div key={challenge.id} variants={item} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/app/challenges/${challenge.slug}`)}
              className="d-card p-4 flex items-center gap-4 cursor-pointer transition-all"
              style={solved ? { borderColor: '#58CC0260', backgroundColor: '#F0FFE530' } : {}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-lg font-bold flex-shrink-0"
                style={{ backgroundColor: solved ? '#58CC02' : diff.bg, color: solved ? 'white' : diff.color }}>
                {solved ? <Star className="w-5 h-5 text-white" /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{challenge.title}</p>
                  {solved && <span className="d-badge text-[9px]" style={{ backgroundColor: '#F0FFE5', color: '#58CC02' }}>Solved</span>}
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{challenge.category}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="d-badge text-[10px]" style={{ backgroundColor: diff.bg, color: diff.color }}>{diff.label}</span>
                  <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Zap className="w-3 h-3" style={{ color: '#FFC800' }} /> {challenge.xpReward} XP
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                <Swords className="w-4 h-4" style={{ color: solved ? '#58CC02' : 'var(--text-muted)' }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-4" />
    </motion.div>
  );
}
