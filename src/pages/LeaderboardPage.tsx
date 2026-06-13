import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown, Medal, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface Leader {
  rank: number;
  user_id: string;
  display_name: string;
  avatar: string | null;
  level: number;
  xp: number;
  streak: number;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

const MEDAL_COLORS = ['#FFC800', '#AFAFAF', '#FF9600'];

function Avatar({ entry, size = 'md', isMe }: { entry: Leader; size?: 'sm' | 'md' | 'lg'; isMe: boolean }) {
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-lg' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  if (entry.avatar) {
    return (
      <img src={entry.avatar} alt={entry.display_name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 border-2`}
        style={{ borderColor: isMe ? '#58CC02' : 'var(--border)' }} />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ backgroundColor: isMe ? '#58CC02' : 'var(--surface)', color: isMe ? 'white' : 'var(--text-light)' }}>
      {(entry.display_name?.[0] || '?').toUpperCase()}
    </div>
  );
}

export default function LeaderboardPage() {
  const { profile } = useAuth();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.from('profiles') as any)
          .select('user_id, display_name, avatar, level, xp, current_streak, created_at')
          .order('xp', { ascending: false })
          .order('current_streak', { ascending: false })
          .limit(500);

        if (error) throw error;

        // Show ALL profiles that exist in DB — every registered user has a profile
        // Only skip truly broken rows with no user_id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validPlayers = (data || []).filter((p: any) => !!p.user_id);

        setLeaders(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          validPlayers.map((p: any, i: number) => ({
            rank: i + 1,
            user_id: p.user_id,
            display_name: p.display_name || 'Learner',
            avatar: p.avatar || null,
            level: p.level || 1,
            xp: p.xp || 0,
            streak: p.current_streak || 0,
          }))
        );
      } catch (e) {
        console.error('Leaderboard fetch error:', e);
      }
      setIsLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const top3 = leaders.slice(0, 3);
  const myRank = leaders.findIndex(l => l.user_id === profile?.user_id) + 1;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="d-card h-16 animate-pulse" style={{ opacity: 0.5 }} />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FFC800, #FF9600)' }}>
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Diamond League</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {leaders.length} players · {myRank > 0 ? `You're #${myRank}` : 'Join the leaderboard!'}
        </p>
      </motion.div>

      {/* Top 3 podium */}
      {top3.length >= 1 && (
        <motion.div variants={item} className="flex items-end justify-center gap-3 pt-4 pb-2">
          {(top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3.length === 2 ? [top3[1], top3[0]] : [top3[0]]).map((entry, idx) => {
            const rank = top3.length >= 3 ? (idx === 1 ? 1 : idx === 0 ? 2 : 3) : top3.length === 2 ? (idx === 1 ? 1 : 2) : 1;
            const isFirst = rank === 1;
            const isMe = entry.user_id === profile?.user_id;
            const podiumColors = ['#C0C0C0', '#FFD700', '#CD7F32'];
            const heights = top3.length >= 3 ? ['h-20', 'h-28', 'h-16'] : ['h-20', 'h-28'];
            const heightIdx = top3.length >= 3 ? idx : idx;
            return (
              <div key={rank} className={`flex flex-col items-center ${isFirst ? '-mt-4' : ''}`}>
                {isFirst && <Crown className="w-5 h-5 mb-1" style={{ color: '#FFC800' }} />}
                <Avatar entry={entry} size={isFirst ? 'lg' : 'md'} isMe={isMe} />
                <div className={`w-16 ${heights[heightIdx] ?? 'h-16'} rounded-t-2xl flex flex-col items-center justify-center mt-2`}
                  style={{ backgroundColor: podiumColors[rank - 1] + '30', border: `2px solid ${podiumColors[rank - 1]}60` }}>
                  <span className="font-display text-lg font-black" style={{ color: podiumColors[rank - 1] }}>#{rank}</span>
                </div>
                <p className="text-[10px] font-bold mt-1 max-w-[60px] truncate text-center" style={{ color: 'var(--text)' }}>
                  {entry.display_name}
                </p>
                <p className="text-[10px]" style={{ color: '#FFC800' }}>{entry.xp.toLocaleString()} XP</p>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Full ranked list — ALL players by rank */}
      <motion.div variants={item} className="d-card overflow-hidden p-0">
        {leaders.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>No players yet!</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Complete lessons to appear here</p>
          </div>
        ) : leaders.map((entry) => {
          const isMe = entry.user_id === profile?.user_id;
          return (
            <motion.div key={entry.user_id} variants={item}
              className="flex items-center gap-3 px-4 py-3 border-b last:border-0 transition-colors"
              style={{ borderColor: 'var(--border)', backgroundColor: isMe ? '#58CC0210' : 'transparent' }}>
              {/* Rank */}
              <div className="w-7 flex-shrink-0 text-center">
                {entry.rank <= 3
                  ? <Medal className="w-5 h-5 mx-auto" style={{ color: MEDAL_COLORS[entry.rank - 1] }} />
                  : <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{entry.rank}</span>}
              </div>
              {/* Avatar */}
              <Avatar entry={entry} size="md" isMe={isMe} />
              {/* Name + level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold truncate" style={{ color: isMe ? '#58CC02' : 'var(--text)' }}>
                    {entry.display_name}
                  </p>
                  {isMe && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ backgroundColor: '#58CC0220', color: '#58CC02' }}>You</span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Level {entry.level}</p>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-3 text-xs flex-shrink-0">
                <span className="flex items-center gap-0.5 font-bold" style={{ color: '#FFC800' }}>
                  <Zap className="w-3 h-3" /> {entry.xp.toLocaleString()}
                </span>
                {entry.streak > 0 && (
                  <span className="flex items-center gap-0.5 font-bold" style={{ color: '#FF9600' }}>
                    <Flame className="w-3 h-3" /> {entry.streak}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="h-4" />
    </motion.div>
  );
}