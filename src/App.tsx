import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import TodayPage from './pages/TodayPage';
import CalendarPage from './pages/CalendarPage';
import AllTodosPage from './pages/AllTodosPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import CategoryPage from './pages/CategoryPage';
import AuthPage from './pages/AuthPage';
import { useApp } from './context/AppContext';
import { CheckSquare } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center animate-pulse">
          <CheckSquare size={28} className="text-white" />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">불러오는 중...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentScreen } = useApp();
  return (
    <Layout>
      {currentScreen === 'today'    && <TodayPage />}
      {currentScreen === 'calendar' && <CalendarPage />}
      {currentScreen === 'all'      && <AllTodosPage />}
      {currentScreen === 'notes'    && <NotesPage />}
      {currentScreen === 'settings' && <SettingsPage />}
      {currentScreen === 'categories' && <CategoryPage />}
      <InstallPrompt />
    </Layout>
  );
}

function Root() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthPage />;

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
