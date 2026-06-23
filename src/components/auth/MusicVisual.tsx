'use client';

import { motion } from 'framer-motion';
import { Music, Headphones, Radio, Mic2 } from 'lucide-react';

const ALBUMS = [
  { color: '#1DB954', label: 'Lo-Fi Beats', sub: 'Chill vibes', icon: '🎵' },
  { color: '#7C3AED', label: 'Electronic', sub: 'Deep focus', icon: '⚡' },
  { color: '#EC4899', label: 'Synthwave', sub: 'Retro nights', icon: '🌆' },
  { color: '#F59E0B', label: 'Jazz & Soul', sub: 'Late evening', icon: '🎷' },
];


export default function MusicVisual() {
  return (
    <div className="music-visual">
      {/* Brand */}
      <motion.div
        className="music-visual-brand"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="music-visual-logo">
          <img src="/favicon.jpg" alt="mTune Logo" className="w-6 h-6 rounded-md" />
        </div>
        <span className="music-visual-brand-name">mTune</span>
      </motion.div>

      {/* Central hero orb */}
      <div className="music-visual-hero">
        <motion.div
          className="music-visual-orb-outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="music-visual-orb-track" />
        </motion.div>
        <motion.div
          className="music-visual-orb"
          animate={{ scale: [1, 1.04, 1], boxShadow: ['0 0 60px rgba(29,185,84,0.3)', '0 0 100px rgba(29,185,84,0.5)', '0 0 60px rgba(29,185,84,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Headphones size={48} className="music-visual-orb-icon" />
        </motion.div>

        {/* Equalizer bars */}
        <div className="music-visual-eq">
          {[0.6, 1, 0.8, 1, 0.7, 0.9, 0.5].map((h, i) => (
            <motion.div
              key={i}
              className="music-visual-eq-bar"
              animate={{ scaleY: [h, 1, h * 0.4, 0.9, h] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating album cards */}
      <div className="music-visual-albums">
        {ALBUMS.map((album, i) => (
          <motion.div
            key={album.label}
            className="music-visual-album-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.03 }}
          >
            <div
              className="music-visual-album-art"
              style={{ background: `linear-gradient(135deg, ${album.color}33, ${album.color}11)`, borderColor: `${album.color}44` }}
            >
              <span className="text-xl">{album.icon}</span>
            </div>
            <div className="music-visual-album-info">
              <p className="music-visual-album-label">{album.label}</p>
              <p className="music-visual-album-sub">{album.sub}</p>
            </div>
            <div className="music-visual-album-dot" style={{ background: album.color }} />
          </motion.div>
        ))}
      </div>


      {/* Floating icons */}
      {[Radio, Mic2].map((Icon, i) => (
        <motion.div
          key={i}
          className="music-visual-float-icon"
          style={{ top: `${30 + i * 35}%`, right: i % 2 === 0 ? '8%' : '12%' }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        >
          <Icon size={18} />
        </motion.div>
      ))}

      {/* Tagline */}
      <motion.p
        className="music-visual-tagline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        Your music. Elevated.
      </motion.p>
    </div>
  );
}
