import { useState } from 'react';
import { ChevronRight, LogOut, Moon, Sun, Monitor, Bell, Tag, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { Settings } from '../types';

const SCREEN_OPTIONS: { value: Settings['defaultScreen']; label: string }[] = [
  { value: 'today', label: '홈' },
  { value: 'all', label: '저장소' },
  { value: 'notes', label: '메모' },
];

export default function SettingsPage() {
  const { settings, updateSettings, categories, setCurrentScreen } = useApp();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() { setSigningOut(true); await signOut(); }

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? '';
  const initials = displayName.slice(0, 2).toUpperCase();

  const THEME_OPTS = [
    { value: 'light' as const, label: '라이트', Icon: Sun },
    { value: 'dark' as const, label: '다크', Icon: Moon },
    { value: 'system' as const, label: '시스템', Icon: Monitor },
  ];

  return (
    <div className="px-4 pt-10 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">설정</h1>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-5 mb-5 shadow-lg shadow-sky-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} className="w-14 h-14 rounded-2xl object-cover" alt="" />
            ) : (
              <span className="text-xl font-bold text-white">{initials || '?'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white truncate">{displayName || '사용자'}</p>
            <p className="text-sm text-white/70 truncate mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors border border-white/20 disabled:opacity-50"
          >
            <LogOut size={13} />
            {signingOut ? '...' : '로그아웃'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">테마</h2>
          </div>
          <div className="px-4 pb-4 grid grid-cols-3 gap-2">
            {THEME_OPTS.map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => updateSettings({ theme: value })}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                  settings.theme === value
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon size={18} strokeWidth={settings.theme === value ? 2.5 : 1.8} />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Default screen */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">시작 화면</h2>
          </div>
          <div className="px-4 pb-4">
            <select
              value={settings.defaultScreen}
              onChange={e => updateSettings({ defaultScreen: e.target.value as Settings['defaultScreen'] })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium cursor-pointer"
            >
              {SCREEN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </section>

        {/* Rows */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {/* Notifications */}
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${settings.notifications ? 'bg-sky-100 dark:bg-sky-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Bell size={15} className={settings.notifications ? 'text-sky-500' : 'text-gray-400'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">알림</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">할 일 알림 받기</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ notifications: !settings.notifications })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings.notifications ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Categories */}
          <button
            onClick={() => setCurrentScreen('categories')}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Tag size={15} className="text-violet-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">카테고리 관리</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{categories.length}개</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </section>

        {/* App info */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
              <Info size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1">All Planner</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">v1.0.0</span>
          </div>
        </section>
      </div>
    </div>
  );
}
