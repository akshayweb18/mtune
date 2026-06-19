'use client';

import { motion } from 'framer-motion';
import { LogOut, Mail, Calendar, Music, Shield } from 'lucide-react';
import type { User } from 'firebase/auth';

interface ProfileCardProps {
  user: User;
  onLogout: () => void;
  loggingOut: boolean;
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return email ? email[0].toUpperCase() : 'U';
}

function formatDate(timestamp: string | null): string {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function ProfileCard({ user, onLogout, loggingOut }: ProfileCardProps) {
  const initials = getInitials(user.displayName, user.email);
  const joinDate = formatDate(user.metadata.creationTime ?? null);

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Avatar */}
      <div className="profile-avatar-section">
        <motion.div
          className="profile-avatar-ring"
          animate={{ boxShadow: ['0 0 0 0px rgba(29,185,84,0.3)', '0 0 0 8px rgba(29,185,84,0.1)', '0 0 0 0px rgba(29,185,84,0.3)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName ?? 'User avatar'}
              className="profile-avatar-img"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="profile-avatar-initials">
              <span>{initials}</span>
            </div>
          )}
        </motion.div>

        <div className="profile-identity">
          <h1 className="profile-name">{user.displayName ?? 'Music Lover'}</h1>
          <div className="profile-badge">
            <Music size={11} />
            <span>Premium Listener</span>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="profile-info-list">
        <div className="profile-info-row">
          <div className="profile-info-icon"><Mail size={15} /></div>
          <div className="profile-info-content">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{user.email}</span>
          </div>
        </div>

        <div className="profile-info-row">
          <div className="profile-info-icon"><Calendar size={15} /></div>
          <div className="profile-info-content">
            <span className="profile-info-label">Member since</span>
            <span className="profile-info-value">{joinDate}</span>
          </div>
        </div>

        <div className="profile-info-row">
          <div className="profile-info-icon"><Shield size={15} /></div>
          <div className="profile-info-content">
            <span className="profile-info-label">Account type</span>
            <span className="profile-info-value">
              {user.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email & Password'}
            </span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <motion.button
        id="profile-logout-btn"
        onClick={onLogout}
        disabled={loggingOut}
        className="profile-logout-btn"
        whileHover={{ scale: loggingOut ? 1 : 1.01 }}
        whileTap={{ scale: loggingOut ? 1 : 0.97 }}
      >
        <LogOut size={16} />
        <span>{loggingOut ? 'Signing out…' : 'Sign Out'}</span>
      </motion.button>
    </motion.div>
  );
}
