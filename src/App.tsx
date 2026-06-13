import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { TRPCProvider } from '@/providers/trpc';
import ErrorBoundary from '@/components/ErrorBoundary';

import LandingPage from '@/pages/LandingPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/pages/Dashboard';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LessonPlayerPage from '@/pages/LessonPlayerPage';
import QuizPage from '@/pages/QuizPage';
import ChallengesPage from '@/pages/ChallengesPage';
import ChallengeDetailPage from '@/pages/ChallengeDetailPage';
import AIMentorPage from '@/pages/AIMentorPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AchievementsPage from '@/pages/AchievementsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import GamesPage from '@/pages/games/GamesPage';
import AdminPage from '@/pages/AdminPage';

function PrivateRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isLoggedIn, isLoading, isAdmin } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/app/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <TRPCProvider>
        <ThemeProvider>
          <AuthProvider>
            <GameProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="courses/:slug" element={<CourseDetailPage />} />
                  <Route path="courses/:courseSlug/:moduleSlug/:lessonSlug" element={<LessonPlayerPage />} />
                  <Route path="quiz/:quizId" element={<QuizPage />} />
                  <Route path="challenges" element={<ChallengesPage />} />
                  <Route path="challenges/:slug" element={<ChallengeDetailPage />} />
                  <Route path="mentor" element={<AIMentorPage />} />
                  <Route path="leaderboard" element={<LeaderboardPage />} />
                  <Route path="achievements" element={<AchievementsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="games" element={<GamesPage />} />
                  <Route path="admin" element={<PrivateRoute requireAdmin><AdminPage /></PrivateRoute>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GameProvider>
          </AuthProvider>
        </ThemeProvider>
      </TRPCProvider>
    </ErrorBoundary>
  );
}
