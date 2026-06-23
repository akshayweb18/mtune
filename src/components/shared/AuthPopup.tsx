'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithGoogle } from '@/lib/auth';
import { usePlayerStore } from '@/store/usePlayerStore';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuthenticated = usePlayerStore((s) => s.setAuthenticated);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      setAuthenticated(true);
      onClose();
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoToAuth = () => {
    onClose();
    router.push('/auth');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9000] bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup — centered on desktop, bottom sheet on mobile */}
          <div className="fixed inset-0 z-[9001] flex items-end md:items-center justify-center pointer-events-none px-0 md:px-4">
            <motion.div
              className="w-full md:w-[460px] pointer-events-auto"
              initial={{ opacity: 0, scale: 0.92, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 60 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            >
              <div
                className="relative rounded-t-[28px] md:rounded-[28px] overflow-hidden"
                style={{
                  background: '#121212',
                  boxShadow: '0 -8px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)',
                }}
              >
                {/* Top gradient accent */}
                <div
                  className="absolute top-0 inset-x-0 h-1 rounded-t-[28px]"
                  style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <div className="px-8 pt-10 pb-10 flex flex-col items-center text-center">
                  {/* Logo */}
                  <motion.img
                    src="/favicon.jpg"
                    alt="mTune"
                    className="w-16 h-16 rounded-2xl mb-6"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
                    style={{ boxShadow: '0 8px 32px rgba(255,215,0,0.35)' }}
                  />

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-[28px] font-black text-white tracking-tight mb-2 leading-tight"
                  >
                    Continue listening
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[14px] text-white/55 mb-7 leading-relaxed max-w-[300px]"
                  >
                    Create an account to unlock unlimited music, playlists and personalized recommendations.
                  </motion.p>

                  {/* Feature pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className="flex flex-wrap justify-center gap-2 mb-7"
                  >
                    {['🎵 Unlimited songs', '⏭️ Skip freely', '💛 Save favorites', '📱 Any device'].map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-white/70 border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        {f}
                      </span>
                    ))}
                  </motion.div>

                  {/* Error */}
                  {error && (
                    <p className="text-red-400 text-[12px] mb-4">{error}</p>
                  )}

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="flex flex-col gap-3 w-full"
                  >
                    {/* Google Sign In */}
                    <button
                      onClick={handleGoogle}
                      disabled={googleLoading}
                      className="w-full py-3.5 rounded-full font-semibold text-[14px] text-white flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-[0.98] border border-white/15 disabled:opacity-60"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      )}
                      {googleLoading ? 'Signing in…' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[11px] text-white/35 font-medium">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Sign up free */}
                    <button
                      onClick={handleGoToAuth}
                      className="w-full py-3.5 rounded-full font-bold text-[15px] text-black transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}
                    >
                      Sign up free
                    </button>

                    {/* Log in */}
                    <button
                      onClick={handleGoToAuth}
                      className="w-full py-3.5 rounded-full font-bold text-[15px] text-white border border-white/20 hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                      Log in
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
