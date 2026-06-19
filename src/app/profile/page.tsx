'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfileCard from '@/components/profile/ProfileCard';
import { signOutUser } from '@/lib/auth';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth');
  }, [user, loading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOutUser();
    router.push('/auth');
  };

  if (loading || !user) {
    return (
      <div className="profile-page-loading">
        <Loader2 size={32} className="animate-spin text-[#1DB954]" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Back button */}
      <motion.button
        onClick={() => router.push('/')}
        className="profile-back-btn"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Back to home"
        id="profile-back-btn"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </motion.button>

      {/* Profile card */}
      <ProfileCard user={user} onLogout={handleLogout} loggingOut={loggingOut} />
    </div>
  );
}
