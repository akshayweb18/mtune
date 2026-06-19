'use client';

import { motion } from 'framer-motion';

export default function AuthBackground() {
  return (
    <div className="auth-bg" aria-hidden="true">
      {/* Deep base */}
      <div className="auth-bg-base" />

      {/* Aurora blobs */}
      <motion.div
        className="aurora-blob aurora-blob-1"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-blob aurora-blob-2"
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -50, 0],
          scale: [1, 0.85, 1.2, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-blob aurora-blob-3"
        animate={{
          x: [0, 40, -60, 0],
          y: [0, -40, 80, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-blob aurora-blob-4"
        animate={{
          x: [0, -30, 60, 0],
          y: [0, 70, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Noise overlay for depth */}
      <div className="auth-bg-noise" />

      {/* Radial vignette */}
      <div className="auth-bg-vignette" />
    </div>
  );
}
