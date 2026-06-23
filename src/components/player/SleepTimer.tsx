'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, X, Check } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { showToast } from '@/components/shared/Toast';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hr', minutes: 90 },
  { label: '2 hours', minutes: 120 },
];

interface SleepTimerProps {
  dropUp?: boolean;
}

export function SleepTimer({ dropUp = true }: SleepTimerProps) {
  const [open, setOpen]           = useState(false);
  const [activeMin, setActiveMin] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(0); // seconds
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const { pause } = usePlayerStore();

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = (minutes: number) => {
    clearTimer();
    setActiveMin(minutes);
    setRemaining(minutes * 60);
    setOpen(false);
    showToast(`Sleep timer: ${minutes} min`, 'info');

    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearTimer();
          setActiveMin(null);
          usePlayerStore.getState().pause();
          showToast('Sleep timer — music paused 🌙', 'info');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelTimer = () => {
    clearTimer();
    setActiveMin(null);
    setRemaining(0);
    showToast('Sleep timer cancelled', 'info');
  };

  useEffect(() => () => clearTimer(), []);

  const fmtRemaining = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        title="Sleep timer"
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all',
          activeMin
            ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30'
            : 'text-[#A7A7A7] hover:text-white hover:bg-white/5'
        )}
      >
        <Timer className="w-3.5 h-3.5" />
        {activeMin ? fmtRemaining() : 'Sleep'}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 bg-[#282828] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[300] w-[160px]",
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          )}
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
        >
          <p className="px-3 py-2 text-[11px] font-bold text-white/40 uppercase tracking-wider border-b border-white/5">
            Sleep Timer
          </p>
          {OPTIONS.map(o => (
            <button
              key={o.minutes}
              onClick={() => startTimer(o.minutes)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-[13px] hover:bg-white/8 transition-colors',
                activeMin === o.minutes ? 'text-[#FFD700] font-bold' : 'text-white font-medium'
              )}
            >
              {o.label}
              {activeMin === o.minutes && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
          {activeMin && (
            <>
              <div className="h-px bg-white/5" />
              <button
                onClick={cancelTimer}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors font-medium"
              >
                <X className="w-3.5 h-3.5" /> Cancel timer
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
