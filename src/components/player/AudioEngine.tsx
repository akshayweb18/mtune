'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';

export function AudioEngine() {
  const audioRef            = useRef<HTMLAudioElement | null>(null);
  const currentSongIdRef    = useRef<string | null>(null);
  const rafRef              = useRef<number>(0);
  const lastProgressRef     = useRef<number>(0);

  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying   = usePlayerStore((s) => s.isPlaying);
  const volume      = usePlayerStore((s) => s.volume);
  const isMuted     = usePlayerStore((s) => s.isMuted);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);

  // ── Initialize audio element once ────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload     = 'auto';
    audioRef.current  = audio;

    // Expose globally so players can seek
    (window as any).__audioElement = audio;

    // Smooth progress via RAF (updates state only every ~0.4s to reduce re-renders)
    const updateProgress = () => {
      if (audio && !audio.paused) {
        const t = audio.currentTime;
        if (Math.abs(t - lastProgressRef.current) >= 0.4) {
          lastProgressRef.current = t;
          setProgress(t);

          // Keep lock-screen position in sync
          if ('mediaSession' in navigator && audio.duration) {
            try {
              navigator.mediaSession.setPositionState({
                duration:     audio.duration,
                playbackRate: audio.playbackRate,
                position:     t,
              });
            } catch (_) {}
          }
        }
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleEnded = () => {
      const { isLooping, next } = usePlayerStore.getState();
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    const handleError = () => console.error('Audio error:', audio.src);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended',          handleEnded);
    audio.addEventListener('error',          handleError);

    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended',          handleEnded);
      audio.removeEventListener('error',          handleError);
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      audio.src = '';
      (window as any).__audioElement = null;
    };
  }, []);

  // ── Register / update Media Session when song changes ────────────────────
  useEffect(() => {
    if (!currentSong || !('mediaSession' in navigator)) return;

    // Build artwork array from the song's image array (all available sizes)
    const artwork: MediaImage[] = (currentSong.image || [])
      .filter((img) => img?.url)
      .map((img) => ({
        src:   img.url,
        sizes: img.quality || '500x500',
        type:  'image/jpeg',
      }));

    // Fallback: use the highest-res url if no image array
    if (artwork.length === 0) {
      const fallbackUrl =
        currentSong.image?.[2]?.url ||
        currentSong.image?.[1]?.url ||
        currentSong.image?.[0]?.url;
      if (fallbackUrl) {
        artwork.push({ src: fallbackUrl, sizes: '500x500', type: 'image/jpeg' });
      }
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title:  currentSong.name || 'Unknown',
      artist: currentSong.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown Artist',
      album:  currentSong.album?.name || 'mTune',
      artwork,
    });

    // Media Session action handlers (lock-screen buttons)
    const store = usePlayerStore.getState;

    navigator.mediaSession.setActionHandler('play', () => {
      audioRef.current?.play().catch(() => {});
      usePlayerStore.setState({ isPlaying: true });
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
      usePlayerStore.setState({ isPlaying: false });
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      store().next();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      store().previous();
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
        setProgress(details.seekTime);
      }
    });

    // Initial position state
    if (audioRef.current?.duration) {
      try {
        navigator.mediaSession.setPositionState({
          duration:     audioRef.current.duration,
          playbackRate: audioRef.current.playbackRate,
          position:     audioRef.current.currentTime,
        });
      } catch (_) {}
    }
  }, [currentSong?.id]);

  // ── Sync playback state with Media Session ────────────────────────────────
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  // ── When currentSong changes → load + auto-play ───────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (currentSongIdRef.current === currentSong.id) return;
    currentSongIdRef.current = currentSong.id;

    const urls = currentSong.downloadUrl;
    if (!urls || urls.length === 0) return;

    const qualityOrder = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
    let bestUrl = urls[urls.length - 1]?.url;
    for (const q of qualityOrder) {
      const found = urls.find((u) => u.quality === q);
      if (found?.url) { bestUrl = found.url; break; }
    }

    if (!bestUrl) return;

    lastProgressRef.current = 0;
    audio.src = bestUrl;
    audio.load();
    audio.play().catch(() => {});

    useLibraryStore.getState().addToHistory(currentSong);
  }, [currentSong?.id]);

  // ── Play / Pause ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ── Volume & Mute ─────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  return null;
}
