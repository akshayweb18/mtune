'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '@/lib/auth';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email.';
      setError(msg.includes('user-not-found') ? 'No account found with this email.' : 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="forgot"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="forgot-form"
    >
      <button
        type="button"
        onClick={onBack}
        className="forgot-back-btn"
        aria-label="Back to login"
      >
        <ArrowLeft size={16} />
        <span>Back to login</span>
      </button>

      <div className="forgot-header">
        <h2 className="forgot-title">Reset password</h2>
        <p className="forgot-subtitle">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="forgot-success"
          >
            <CheckCircle2 size={40} className="forgot-success-icon" />
            <p className="forgot-success-title">Email sent!</p>
            <p className="forgot-success-sub">Check <strong>{email}</strong> for a reset link.</p>
            <button type="button" onClick={onBack} className="auth-btn auth-btn-primary" style={{ marginTop: '1.5rem' }}>
              Back to login
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="forgot-fields">
            <div className="auth-field-group">
              <label htmlFor="reset-email" className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input auth-input-icon-left"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="auth-error"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              className="auth-btn auth-btn-primary"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Sending…</>
              ) : (
                'Send reset link'
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
