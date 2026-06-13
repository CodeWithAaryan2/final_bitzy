import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2, Zap, BookOpen, Swords, Flame, ArrowLeft, Shield, BarChart3, Activity, Gamepad2, Search, XCircle, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface PlayerProfile {
  id: number;
  user_id: string;
  display_name: string | null;
  level: number;
  xp: number;
  coins: number;
  current_streak: number;
  longest_streak: number;
  role: string;
  created_at: string;
}

const C = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const I = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'xp' | 'joined' | 'streak'>('xp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('xp', { ascending: false });
    if (error) {
      console.error('Error fetching players:', error);
    } else {
      setPlayers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchPlayers();
  }, [isAdmin]);

  const removePlayer = async (id: number) => {
    const player = players.find((p) => p.id === id);
    if (!player) return;

    // Delete auth user (this cascades to profile via ON DELETE CASCADE)
    const { error } = await supabase.auth.admin.deleteUser(player.user_id);
    if (error) {
      // Fallback: just delete the profile
      await supabase.from('profiles').delete().eq('id', id);
    }

    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setConfirmId(null);
    showToast('Player removed');
  };

  const clearAll = async () => {
    if (!window.confirm('Remove ALL players? This cannot be undone!')) return;
    for (const player of players) {
      await supabase.from('profiles').delete().eq('id', player.id);
    }
    setPlayers([]);
    showToast('All players removed');
  };

  const filtered = players.filter((p) =>
    (p.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
    p.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const d = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'xp') return (a.xp - b.xp) * d;
    if (sortBy === 'streak') return (a.current_streak - b.current_streak) * d;
    return (a.created_at > b.created_at ? 1 : -1) * d;
  });

  const total = players.length;
  const totalXP = players.reduce((s, p) => s + p.xp, 0);
  const totalCoins = players.reduce((s, p) => s + p.coins, 0);
  const avgStreak = total > 0 ? Math.round(players.reduce((s, p) => s + p.current_streak, 0) / total) : 0;

  const SortBtn = ({ label, field }: { label: string; field: 'xp' | 'joined' | 'streak' }) => (
    <button onClick={() => { setSortBy(field); setSortDir(sortDir === 'desc' ? 'asc' : 'desc'); }}
      className="d-btn d-btn-sm d-btn-ghost" style={{ color: sortBy === field ? '#58CC02' : 'var(--text-muted)' }}>
      {label} {sortBy === field && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
    </button>
  );

  return (
    <div>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-2xl text-sm font-bold text-white"
            style={{ backgroundColor: '#58CC02', boxShadow: '0 4px 0 #45A301' }}>{toast}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/app/dashboard')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-light)' }} />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" style={{ color: '#FF9600' }} />
          <h1 className="font-display text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-xl" style={{ backgroundColor: '#F0FFE5' }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#58CC02' }} />
          <span className="text-xs font-bold" style={{ color: '#58CC02' }}>Online</span>
        </div>
      </div>

      <motion.div variants={C} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={I} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Players', value: total, icon: Users, c: '#58CC02', bg: '#F0FFE5' },
            { label: 'Total XP', value: totalXP.toLocaleString(), icon: Zap, c: '#1CB0F6', bg: '#E5F6FF' },
            { label: 'Total Coins', value: totalCoins.toLocaleString(), icon: Star, c: '#FF9600', bg: '#FFF3E0' },
            { label: 'Avg Streak', value: avgStreak, icon: Flame, c: '#FF4B4B', bg: '#FFE8E8' },
          ].map((s, i) => (
            <div key={i} className="d-card" style={{ backgroundColor: s.bg, borderColor: s.c + '30' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.c + '20' }}>
                  <s.icon className="w-4 h-4" style={{ color: s.c }} />
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
              <p className="font-display text-2xl font-black" style={{ color: s.c }}>{s.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={I}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <h2 className="font-display text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Users className="w-4 h-4" style={{ color: '#58CC02' }} /> Players ({filtered.length})
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="d-input pl-9 text-sm w-full sm:w-48" />
              </div>
              <button onClick={clearAll} className="d-btn d-btn-sm d-btn-red whitespace-nowrap"><Trash2 className="w-3.5 h-3.5" /> Clear All</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sort:</span>
            <SortBtn label="XP" field="xp" />
            <SortBtn label="Streak" field="streak" />
            <SortBtn label="Joined" field="joined" />
          </div>

          {loading ? (
            <div className="d-card p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading players...</div>
          ) : (
            <>
              <div className="hidden md:block d-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--surface)' }}>
                        {['Player', 'Level', 'XP', 'Coins', 'Streak', 'Role', 'Joined', ''].map((h, i) => (
                          <th key={i} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((p, i) => (
                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                          className="border-b" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#58CC02' }}>
                                {(p.display_name || 'L')[0].toUpperCase()}
                              </div>
                              <span className="text-sm font-bold">{p.display_name || 'Learner'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className="d-badge" style={{ backgroundColor: '#F0FFE5', color: '#58CC02' }}>Lv.{p.level}</span></td>
                          <td className="px-4 py-3 text-sm font-bold" style={{ color: '#1CB0F6' }}>{p.xp}</td>
                          <td className="px-4 py-3 text-sm font-bold" style={{ color: '#FF9600' }}>{p.coins}</td>
                          <td className="px-4 py-3 text-sm flex items-center gap-1"><Flame className="w-3.5 h-3.5" style={{ color: '#FF4B4B' }} /> {p.current_streak}</td>
                          <td className="px-4 py-3"><span className="d-badge text-[10px]" style={{ backgroundColor: p.role === 'admin' ? '#FFF3E0' : '#F0FFE5', color: p.role === 'admin' ? '#FF9600' : '#58CC02' }}>{p.role}</span></td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            {confirmId === p.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => removePlayer(p.id)} className="d-btn d-btn-sm d-btn-red px-2 py-1"><Trash2 className="w-3 h-3" /></button>
                                <button onClick={() => setConfirmId(null)} className="d-btn d-btn-sm d-btn-ghost px-2 py-1"><XCircle className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmId(p.id)} className="p-1.5 rounded-lg" style={{ color: '#FF4B4B' }}><Trash2 className="w-4 h-4" /></button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                      {sorted.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No players found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:hidden space-y-2">
                {sorted.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="d-card p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#58CC02' }}>
                        {(p.display_name || 'L')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{p.display_name || 'Learner'}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-[10px] font-bold" style={{ color: '#1CB0F6' }}>XP: {p.xp}</span>
                          <span className="text-[10px] font-bold" style={{ color: '#FF9600' }}>Coins: {p.coins}</span>
                          <span className="text-[10px] font-bold" style={{ color: p.role === 'admin' ? '#FF9600' : '#58CC02' }}>{p.role}</span>
                        </div>
                      </div>
                      {confirmId === p.id ? (
                        <div className="flex flex-col gap-1">
                          <button onClick={() => removePlayer(p.id)} className="d-btn d-btn-sm d-btn-red px-2 py-1"><Trash2 className="w-3 h-3" /></button>
                          <button onClick={() => setConfirmId(null)} className="d-btn d-btn-sm d-btn-ghost px-2 py-1"><XCircle className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(p.id)} className="p-2 rounded-lg" style={{ color: '#FF4B4B' }}><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div variants={I} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="d-card d-card-green">
            <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: '#58CC02' }} /> Platform Overview
            </h3>
            {[
              { label: 'Active Courses', value: '15+', icon: BookOpen, color: '#58CC02' },
              { label: 'Game Modes', value: '7', icon: Gamepad2, color: '#FF4B4B' },
              { label: 'Total Lessons', value: '200+', icon: BookOpen, color: '#1CB0F6' },
              { label: 'Challenges', value: '50+', icon: Swords, color: '#FF9600' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: '#D4EDBC' }}>
                <div className="flex items-center gap-2"><r.icon className="w-4 h-4" style={{ color: r.color }} /><span className="text-sm">{r.label}</span></div>
                <span className="text-sm font-bold" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div className="d-card d-card-blue">
            <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: '#1CB0F6' }} /> Recent Activity
            </h3>
            {players.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-2 py-2 border-b last:border-0" style={{ borderColor: '#B8E8FD' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: '#1CB0F6' }}>
                  {(p.display_name || 'L')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{p.display_name || 'Learner'}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Joined {new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#1CB0F6' }}>Lv.{p.level}</span>
              </div>
            ))}
            {players.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No activity yet</p>}
          </div>
        </motion.div>

        <div className="h-4" />
      </motion.div>
    </div>
  );
}
