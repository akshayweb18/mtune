'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GoogleSignInButton from './GoogleSignInButton';
import ForgotPasswordForm from './ForgotPasswordForm';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from '@/lib/auth';

type Tab = 'login' | 'signup';

function parseFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const resetFields = () => {
    setEmail(''); setPassword(''); setConfirmPassword(''); setDisplayName(''); setError('');
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setShowForgot(false);
    setError('');
    resetFields();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(parseFirebaseError(code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (tab === 'signup') {
      if (!displayName.trim()) { setError('Please enter your name.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    }
    setLoading(true);
    try {
      if (tab === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName.trim());
      }
      router.push('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(parseFirebaseError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      {/* Header */}
      <div className="auth-form-header">
        <motion.div
          className="auth-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="auth-logo-icon">♪</span>
          <span className="auth-logo-name">mTune</span>
        </motion.div>
        <motion.p
          className="auth-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tab === 'login' ? 'Welcome back' : 'Join millions of listeners'}
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="auth-tabs" role="tablist">
        {(['login', 'signup'] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => handleTabChange(t)}
            className={`auth-tab ${tab === t ? 'auth-tab-active' : ''}`}
            id={`auth-tab-${t}`}
          >
            {t === 'login' ? 'Sign In' : 'Sign Up'}
            {tab === t && (
              <motion.div
                layoutId="auth-tab-indicator"
                className="auth-tab-indicator"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Form panel */}
      <AnimatePresence mode="wait">
        {showForgot ? (
          <ForgotPasswordForm key="forgot" onBack={() => setShowForgot(false)} />
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {/* Google */}
            <div className="auth-social-section">
              <GoogleSignInButton onClick={handleGoogle} loading={googleLoading} />
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or continue with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="auth-fields" noValidate>
              {/* Display name (signup only) */}
              <AnimatePresence>
                {tab === 'signup' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="auth-field-group"
                  >
                    <label htmlFor="auth-name" className="auth-label">Full name</label>
                    <div className="auth-input-wrap">
                      <User size={15} className="auth-input-icon" />
                      <input
                        id="auth-name"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="auth-input auth-input-icon-left"
                        autoComplete="name"
                        disabled={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="auth-field-group">
                <label htmlFor="auth-email" className="auth-label">Email address</label>
                <div className="auth-input-wrap">
                  <Mail size={15} className="auth-input-icon" />
                  <input
                    id="auth-email"
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

              {/* Password */}
              <div className="auth-field-group">
                <label htmlFor="auth-password" className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={15} className="auth-input-icon" />
                  <input
                    id="auth-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'}
                    className="auth-input auth-input-icon-left auth-input-icon-right"
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="auth-input-toggle"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm password (signup only) */}
              <AnimatePresence>
                {tab === 'signup' && (
                  <motion.div
                    key="confirm-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="auth-field-group"
                  >
                    <label htmlFor="auth-confirm" className="auth-label">Confirm password</label>
                    <div className="auth-input-wrap">
                      <Lock size={15} className="auth-input-icon" />
                      <input
                        id="auth-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="auth-input auth-input-icon-left auth-input-icon-right"
                        autoComplete="new-password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="auth-input-toggle"
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember me + Forgot password */}
              {tab === 'login' && (
                <div className="auth-row">
                  <label className="auth-remember" htmlFor="remember-me">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="auth-checkbox"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="auth-forgot-link"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="auth-error-box"
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                id={`auth-submit-${tab}`}
                type="submit"
                disabled={loading || googleLoading}
                className="auth-btn auth-btn-primary"
                whileHover={{ scale: (loading || googleLoading) ? 1 : 1.01 }}
                whileTap={{ scale: (loading || googleLoading) ? 1 : 0.98 }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> {tab === 'login' ? 'Signing in…' : 'Creating account…'}</>
                ) : (
                  tab === 'login' ? 'Sign In' : 'Create Account'
                )}
              </motion.button>

              {/* Terms (signup) */}
              {tab === 'signup' && (
                <p className="auth-terms">
                  By signing up, you agree to our{' '}
                  <span className="auth-terms-link">Terms of Service</span>{' '}
                  and{' '}
                  <span className="auth-terms-link">Privacy Policy</span>.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
