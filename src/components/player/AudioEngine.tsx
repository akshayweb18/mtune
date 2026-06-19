'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);

  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const next = usePlayerStore((s) => s.next);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioRef.current = audio;

    // Expose audio element globally so players can seek
    (window as any).__audioElement = audio;

    // Use requestAnimationFrame for smooth progress updates instead of timeupdate
    // This throttles to ~60fps but we only update state every 500ms to reduce re-renders
    const updateProgress = () => {
      if (audio && !audio.paused) {
        const currentTime = audio.currentTime;
        // Only trigger a state update if progress changed by at least 0.4 seconds
        // This prevents 4x/sec re-renders from timeupdate
        if (Math.abs(currentTime - lastProgressRef.current) >= 0.4) {
          lastProgressRef.current = currentTime;
          setProgress(currentTime);
        }
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      const isLooping = usePlayerStore.getState().isLooping;
      if (isLooping) {
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      } else {
        usePlayerStore.getState().next();
      }
    };
    const handleError = () => {
      console.error('Audio error for:', audio.src);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Start the animation frame loop
    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      audio.src = '';
      (window as any).__audioElement = null;
    };
  }, []);

  // When currentSong changes → load + auto-play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // Skip if same song
    if (currentSongIdRef.current === currentSong.id) return;
    currentSongIdRef.current = currentSong.id;

    const urls = currentSong.downloadUrl;
    if (!urls || urls.length === 0) return;

    // Try highest quality first
    const qualityOrder = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
    let bestUrl = urls[urls.length - 1]?.url;
    for (const q of qualityOrder) {
      const found = urls.find((u) => u.quality === q);
      if (found?.url) {
        bestUrl = found.url;
        break;
      }
    }

    if (!bestUrl) return;

    lastProgressRef.current = 0;
    audio.src = bestUrl;
    audio.load();
    audio.play().catch(() => {});
    
    // Add to recently played history
    useLibraryStore.getState().addToHistory(currentSong);
  }, [currentSong?.id]);

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume & Mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  return null;
}
