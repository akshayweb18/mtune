'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

/**
 * useKeyboardShortcuts
 * ─────────────────────
 * Global keyboard shortcuts for the music player (desktop).
 * Does NOT fire when user is typing in an input/textarea.
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

      const store = usePlayerStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          store.togglePlay();
          break;
        case 'ArrowRight':
          if (e.altKey) { e.preventDefault(); store.next(); }
          break;
        case 'ArrowLeft':
          if (e.altKey) { e.preventDefault(); store.previous(); }
          break;
        case 'KeyM':
          store.toggleMute();
          break;
        case 'KeyL':
          store.toggleLoop();
          break;
        case 'KeyS':
          if (e.shiftKey) store.toggleShuffle();
          break;
        case 'ArrowUp':
          if (e.altKey) {
            e.preventDefault();
            store.setVolume(Math.min(1, store.volume + 0.1));
          }
          break;
        case 'ArrowDown':
          if (e.altKey) {
            e.preventDefault();
            store.setVolume(Math.max(0, store.volume - 0.1));
          }
          break;
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
}
