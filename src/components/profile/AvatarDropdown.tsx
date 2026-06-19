'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/lib/auth';

function getInitials(name: string | null, email: string | null): string {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return email ? email[0].toUpperCase() : 'U';
}

export default function AvatarDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!user) return null;

  const initials = getInitials(user.displayName, user.email);

  const handleLogout = async () => {
    setLoggingOut(true);
    setOpen(false);
    await signOutUser();
    router.push('/auth');
    setLoggingOut(false);
  };

  const menuItems = [
    {
      id: 'avatar-menu-profile',
      label: 'Profile',
      icon: User,
      onClick: () => { setOpen(false); router.push('/profile'); },
    },
    {
      id: 'avatar-menu-settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => { setOpen(false); },
    },
    {
      id: 'avatar-menu-logout',
      label: loggingOut ? 'Signing out…' : 'Sign Out',
      icon: LogOut,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="avatar-dropdown-root" ref={ref}>
      {/* Trigger */}
      <motion.button
        id="avatar-trigger-btn"
        onClick={() => setOpen((v) => !v)}
        className="avatar-trigger"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User'}
            className="avatar-img"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="avatar-initials">{initials}</div>
        )}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="avatar-chevron"
        >
          <ChevronDown size={12} />
        </motion.div>
        {/* Online ring */}
        <span className="avatar-online-ring" aria-hidden="true" />
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="avatar-menu"
            role="menu"
            aria-label="Account options"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* User info header */}
            <div className="avatar-menu-header">
              <p className="avatar-menu-name">{user.displayName ?? 'Music Lover'}</p>
              <p className="avatar-menu-email">{user.email}</p>
            </div>

            <div className="avatar-menu-divider" />

            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                id={item.id}
                role="menuitem"
                onClick={item.onClick}
                disabled={loggingOut && item.danger}
                className={`avatar-menu-item ${item.danger ? 'avatar-menu-item-danger' : ''}`}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
