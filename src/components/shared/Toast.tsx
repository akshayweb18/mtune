'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Global toast state
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let toastList: ToastMessage[] = [];

function notifyListeners() {
  for (const listener of toastListeners) {
    listener([...toastList]);
  }
}

export function showToast(message: string, type: ToastType = 'success') {
  const id = `toast-${Date.now()}-${Math.random()}`;
  toastList = [...toastList, { id, message, type }];
  notifyListeners();
  setTimeout(() => {
    toastList = toastList.filter(t => t.id !== id);
    notifyListeners();
  }, 3000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (updated: ToastMessage[]) => setToasts(updated);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-[170px] md:bottom-[110px] left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl text-[13px] font-bold text-white animate-slide-up"
          style={{
            background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(30,30,30,0.97)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-4 h-4 text-white shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-[#22D3EE] shrink-0" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
