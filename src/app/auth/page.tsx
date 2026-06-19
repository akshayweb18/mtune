import type { Metadata } from 'next';
import AuthBackground from '@/components/auth/AuthBackground';
import MusicVisual from '@/components/auth/MusicVisual';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign In — mTune',
  description: 'Sign in to mTune and experience premium music streaming.',
};

export default function AuthPage() {
  return (
    <main className="auth-page" role="main">
      {/* Animated aurora background */}
      <AuthBackground />

      {/* Split screen */}
      <div className="auth-split">
        {/* Left — Music visual (desktop only) */}
        <div className="auth-split-left" aria-hidden="true">
          <MusicVisual />
        </div>

        {/* Right — Auth form */}
        <div className="auth-split-right">
          <div className="auth-card">
            <AuthForm />
          </div>
        </div>
      </div>
    </main>
  );
}
