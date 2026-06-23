'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if user dismissed before
    if (localStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  const handleInstall = async () => {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setDismissed(true);
    setPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-dismissed', '1');
  };

  return (
    <div
      className="fixed bottom-[170px] md:bottom-[90px] left-4 right-4 md:left-auto md:right-6 md:w-[340px] z-[500] rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
      style={{
        background: 'rgba(20,20,20,0.97)',
        border: '1px solid rgba(255,215,0,0.2)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/30 flex items-center justify-center shrink-0">
          <Download className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-white">Install mTune</p>
          <p className="text-[12px] text-white/50 mt-0.5">Add to home screen for app-like experience</p>
        </div>
        <button onClick={handleDismiss} className="text-white/30 hover:text-white p-1 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2.5 rounded-xl bg-white/8 text-white/60 font-bold text-[13px] hover:bg-white/12 transition-colors"
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 py-2.5 rounded-xl bg-[#FFD700] text-black font-bold text-[13px] hover:bg-[#FFC800] transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
