import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('pwa-dismissed') === '1');

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  }

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('pwa-dismissed', '1');
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto bg-gray-900 dark:bg-white text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <Download size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">앱으로 설치하기</p>
        <p className="text-xs text-sky-200 mt-0.5">홈 화면에 추가하면 더 편리해요</p>
      </div>
      <button onClick={install} className="bg-white text-sky-600 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0">
        설치
      </button>
      <button onClick={dismiss} className="text-white/70 hover:text-white flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}
