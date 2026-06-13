import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, BookOpen, Trophy, Sparkles, Swords, Gamepad2,
  Sun, Moon, User, LogOut, Shield, Heart, Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { useTheme } from '@/context/ThemeContext';
import XPPopupOverlay from './XPPopupOverlay';

const sidebarNav = [
  { path: '/app/dashboard', label: 'Learn', icon: Home },
  { path: '/app/courses', label: 'Courses', icon: BookOpen },
  { path: '/app/games', label: 'Play', icon: Gamepad2 },
  { path: '/app/challenges', label: 'Arena', icon: Swords },
  { path: '/app/leaderboard', label: 'League', icon: Trophy },
  { path: '/app/achievements', label: 'Badges', icon: Star },
  { path: '/app/mentor', label: 'Sub AI', icon: Sparkles },
];

const mobileNav = [
  { path: '/app/dashboard', label: 'Learn', icon: Home },
  { path: '/app/courses', label: 'Courses', icon: BookOpen },
  { path: '/app/games', label: 'Play', icon: Gamepad2 },
  { path: '/app/leaderboard', label: 'League', icon: Trophy },
  { path: '/app/profile', label: 'Profile', icon: User },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { xpPopups, dismissPopup } = useGame();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const displayName = profile?.display_name ?? 'Learner';
  const avatar = profile?.avatar;

  return (
    <div className="d-main min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <XPPopupOverlay popups={xpPopups} onDismiss={dismissPopup} />

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="d-sidebar">
        <div className="p-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#071A3D] to-[#0052CC]">
            <img src="/mascot.png" alt="Bitzy" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-[#2B7FFF]">Bitzy</h1>
            <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>Learn to Code</p>
          </div>
        </div>

        <div className="mx-4 mb-3 p-3 rounded-3xl border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#2B7FFF]" style={{ backgroundColor: '#EBF2FF' }}>
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-[#2B7FFF]">{displayName[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="d-progress flex-1 h-2.5">
                  <div className="d-progress-fill" style={{ width: `${(xp % 100)}%` }} />
                </div>
                <span className="text-[10px] font-bold text-[#58CC02]">Lv.{level}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-2">
          {sidebarNav.map((item) => (
            <div key={item.path} onClick={() => navigate(item.path)} className={`d-nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive(item.path) && <div className="ml-auto w-2 h-2 rounded-full bg-[#58CC02]" />}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t-2" style={{ borderColor: 'var(--border)' }}>
          <div onClick={() => navigate('/app/settings')} className="d-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            Settings
          </div>
          {isAdmin && (
            <div onClick={() => navigate('/app/admin')} className="d-nav-item" style={{ color: '#FF9600' }}>
              <Shield className="w-5 h-5" /> Admin Panel
            </div>
          )}
          <div onClick={toggleTheme} className="d-nav-item">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div onClick={logout} className="d-nav-item" style={{ color: '#FF4B4B' }}>
            <LogOut className="w-5 h-5" /> Sign Out
          </div>
        </div>
      </aside>

      {/* ===== MOBILE HEADER ===== */}
      <header className="lg:hidden sticky top-0 z-30 border-b-2" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2B7FFF' }}>
              <img src="/mascot.png" alt="" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-display text-lg font-bold text-[#2B7FFF]">Bitzy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl" style={{ backgroundColor: '#FFF8E0' }}>
              <Heart className="w-3.5 h-3.5 text-[#FF4B4B]" />
              <span className="text-xs font-bold text-[#FF4B4B]">{profile?.energy ?? 0}</span>
            </div>
            <button onClick={toggleTheme} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
              {theme === 'light' ? <Moon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <Sun className="w-4 h-4 text-[#FFC800]" />}
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-5 pb-24 lg:pb-6">
          <Outlet />
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-around py-1 max-w-lg mx-auto">
          {mobileNav.map((item) => {
            const active = isActive(item.path);
            return (
              <motion.button key={item.path} whileTap={{ scale: 0.85 }} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl relative">
                {active && <motion.div layoutId="mobTab" className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(88,204,2,0.1)' }} transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                <item.icon className="w-5 h-5 relative z-10" style={{ color: active ? '#58CC02' : 'var(--text-muted)' }} />
                <span className="text-[10px] font-bold relative z-10 font-display" style={{ color: active ? '#58CC02' : 'var(--text-muted)' }}>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
