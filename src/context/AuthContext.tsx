import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export { getXPForLevel, getLevelFromXP } from '@/context/xpUtils';

export interface Profile {
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
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (username: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, isLoggedIn: false, isLoading: true, isAdmin: false,
  login: async () => ({ error: null }), register: async () => ({ error: null }),
  logout: async () => {}, updateProfile: async () => ({ error: null }), refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (error || !data) {
      console.log('[Auth] fetchProfile error:', error?.message);
      return null;
    }
    return data as unknown as Profile;
  };

  const loadProfile = async (currentUser: User) => {
    // Try immediate fetch first (existing users)
    let p = await fetchProfile(currentUser.id);

    if (!p) {
      // New signup — wait for DB trigger then retry
      for (const delay of [500, 1000, 2000, 3000]) {
        console.log(`[Auth] Profile not found, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        p = await fetchProfile(currentUser.id);
        if (p) break;
      }
    }

    if (!p) {
      // Trigger never fired — create manually
      console.log('[Auth] Creating profile manually...');
      const profileData = {
        user_id: currentUser.id,
        display_name: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'Learner',
        bio: 'Learning to code one day at a time!',
        role: 'user',
        level: 1,
        xp: 50,
        coins: 50,
        energy: 5,
        max_energy: 5,
        current_streak: 1,
        longest_streak: 1,
        last_login_date: new Date().toISOString().split('T')[0],
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertErr } = await (supabase.from('profiles') as any).insert(profileData);
      if (insertErr?.code === '23505') {
        // Race — row created between our check and insert, just fetch
        p = await fetchProfile(currentUser.id);
      } else if (!insertErr) {
        await new Promise(r => setTimeout(r, 300));
        p = await fetchProfile(currentUser.id);
      }
    }

    console.log('[Auth] Profile loaded:', p ? { xp: p.xp, coins: p.coins, energy: p.energy, level: p.level } : 'FAILED');
    // Update streak on every load (login/session restore)
    if (p) {
      const updated = await updateStreak(p, currentUser.id);
      setProfile(updated ?? p);
    } else {
      setProfile(p);
    }
  };

  // Called every time user loads profile — updates streak based on last_login_date
  const updateStreak = async (p: Profile, userId: string): Promise<Profile | null> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = p.last_login_date;

      if (lastLogin === today) return p; // Already logged in today, no change

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = lastLogin === yesterday ? (p.current_streak || 0) + 1 : 1;
      const longestStreak = Math.max(newStreak, p.longest_streak || 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('profiles') as any).update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_login_date: today,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId);

      if (error) { console.error('[Auth] Streak update error:', error.message); return p; }
      return { ...p, current_streak: newStreak, longest_streak: longestStreak, last_login_date: today };
    } catch (e) {
      console.error('[Auth] updateStreak exception:', e);
      return p;
    }
  };

  useEffect(() => {
    let initialDone = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadProfile(u).finally(() => { setIsLoading(false); initialDone = true; });
      } else {
        setIsLoading(false);
        initialDone = true;
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Skip INITIAL_SESSION — getSession already handles it
      if (!initialDone && event === 'INITIAL_SESSION') return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadProfile(u).finally(() => setIsLoading(false));
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) return { error: error.message };
    if (data.user) await loadProfile(data.user);
    return { error: null };
  };

  const register = async (username: string, email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(), password,
      options: { data: { display_name: username } },
    });
    if (error) return { error: error.message };

    if (data.user) {
      await new Promise(r => setTimeout(r, 2000));
      await loadProfile(data.user);
    }
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not logged in' };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id: _uid, id: _id, created_at: _ca, ...safeUpdates } = updates as Record<string, unknown>;
    const updateData = {
      ...safeUpdates,
      updated_at: new Date().toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any)
      .update(updateData)
      .eq('user_id', user.id);
    if (!error) { const p = await fetchProfile(user.id); setProfile(p); }
    return { error: error?.message || null };
  };

  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, isLoggedIn: !!user, isLoading, isAdmin: profile?.role === 'admin',
      login, register, logout, updateProfile, refreshProfile,
    }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
