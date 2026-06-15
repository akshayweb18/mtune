'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import {
  Play, Pause, SkipBack, SkipForward, MoreVertical, Heart,
  Shuffle, Repeat, ChevronDown, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';

export function MobilePlayer() {
  const currentSong   = usePlayerStore((s) => s.currentSong);
  const isPlaying     = usePlayerStore((s) => s.isPlaying);
  const togglePlay    = usePlayerStore((s) => s.togglePlay);
  const progress      = usePlayerStore((s) => s.progress);
  const duration      = usePlayerStore((s) => s.duration);
  const isExpanded    = usePlayerStore((s) => s.isExpanded);
  const setExpanded   = usePlayerStore((s) => s.setExpanded);
  const setProgress   = usePlayerStore((s) => s.setProgress);
  const next          = usePlayerStore((s) => s.next);
  const previous      = usePlayerStore((s) => s.previous);
  const isShuffling   = usePlayerStore((s) => s.isShuffling);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const isLooping     = usePlayerStore((s) => s.isLooping);
  const toggleLoop    = usePlayerStore((s) => s.toggleLoop);
  const { isLiked, toggleLike } = useLibraryStore();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!currentSong) return null;

  const liked       = isLiked(currentSong.id);
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const img         = currentSong.image?.[2]?.url || currentSong.image?.[0]?.url;
  const artistNames = currentSong.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist';

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    setProgress(newTime);
    const audio = (window as any).__audioElement;
    if (audio) audio.currentTime = newTime;
  };

  // ── Mini Player (Spotify pill style) ──────────────────────────────────────
  if (!isExpanded) {
    return (
      <div
        className="md:hidden fixed left-2 right-2 z-[50]"
        style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px) + 8px)' }}
        onClick={() => setExpanded(true)}
      >
        <div
          className="relative flex items-center h-[56px] px-3 gap-3 rounded-xl overflow-hidden cursor-pointer active:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          style={{ background: '#282828' }}
        >
          {/* Album art */}
          <div className="w-[38px] h-[38px] rounded-[4px] overflow-hidden shrink-0">
            {img && <img src={img} alt={currentSong.name} className="w-full h-full object-cover" />}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white truncate">{currentSong.name}</p>
            <p className="text-[11px] text-[#A7A7A7] truncate">{artistNames}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => toggleLike(currentSong)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Heart className={cn('w-5 h-5', liked ? 'fill-[#FFD700] text-[#FFD700]' : 'text-[#B3B3B3]')} />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center text-white"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
          </div>

          {/* Bottom progress line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3a3a3a]">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Full-Screen Player ─────────────────────────────────────────────────────
  return (
    <div className="md:hidden fixed inset-0 z-[100] flex flex-col bg-[#121212]">

      {/* Dynamic blurred background from album art */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {img && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${img})`,
              filter: 'blur(80px) saturate(2)',
              transform: 'scale(1.3)',
              opacity: 0.25,
            }}
          />
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#121212]/70 to-[#121212]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <div
          className="flex items-center justify-between px-4"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 16px), 16px)', paddingBottom: '8px' }}
        >
          <button
            onClick={() => setExpanded(false)}
            className="w-10 h-10 flex items-center justify-center text-white/80 active:opacity-60"
          >
            <ChevronDown className="w-8 h-8" />
          </button>

          <div className="text-center">
            <p className="text-[11px] font-bold text-[#A7A7A7] uppercase tracking-widest">
              {currentSong.album?.name || 'Now playing'}
            </p>
          </div>

          <button className="w-10 h-10 flex items-center justify-center text-white/80 active:opacity-60">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center px-6 py-4 min-h-0">
          <div
            className="w-full max-w-[300px] aspect-square rounded-sm overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.8)] transition-transform duration-500"
            style={{ transform: isPlaying ? 'scale(1)' : 'scale(0.92)' }}
          >
            {img ? (
              <img src={img} alt={currentSong.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#282828]" />
            )}
          </div>
        </div>

        {/* Bottom Controls Area */}
        <div
          className="px-6 flex flex-col"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)' }}
        >
          {/* Title + Like */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-[22px] font-bold text-white truncate">{currentSong.name}</h2>
              <p className="text-[14px] text-[#A7A7A7] truncate mt-0.5">{artistNames}</p>
            </div>
            <button
              onClick={() => toggleLike(currentSong)}
              className="w-10 h-10 flex items-center justify-end active:opacity-60"
            >
              <Heart className={cn('w-7 h-7', liked ? 'fill-[#FFD700] text-[#FFD700]' : 'text-white/70')} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div
              ref={progressBarRef}
              onClick={seekTo}
              onTouchStart={() => setIsDragging(true)}
              onTouchMove={(e) => { if (isDragging) seekTo(e); }}
              onTouchEnd={() => setIsDragging(false)}
              className="w-full h-8 flex items-center cursor-pointer relative group"
            >
              <div className="absolute inset-x-0 h-[4px] bg-[#4D4D4D] rounded-full" />
              <div
                className="absolute h-[4px] bg-white rounded-full"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="absolute w-[14px] h-[14px] bg-white rounded-full -translate-x-1/2 shadow-sm"
                style={{ left: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#A7A7A7] -mt-1">
              <span className="tabular-nums">{fmt(progress)}</span>
              <span className="tabular-nums">{fmt(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={toggleShuffle}
              className={cn('active:opacity-60 transition-opacity relative w-10 h-10 flex items-center justify-center', isShuffling ? 'text-[#FFD700]' : 'text-[#B3B3B3]')}
            >
              <Shuffle className="w-6 h-6" />
              {isShuffling && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />}
            </button>

            <button onClick={previous} className="text-white active:opacity-60 w-12 h-12 flex items-center justify-center">
              <SkipBack className="w-9 h-9 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-[66px] h-[66px] rounded-full bg-white flex items-center justify-center text-black active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>

            <button onClick={next} className="text-white active:opacity-60 w-12 h-12 flex items-center justify-center">
              <SkipForward className="w-9 h-9 fill-current" />
            </button>

            <button
              onClick={toggleLoop}
              className={cn('active:opacity-60 transition-opacity relative w-10 h-10 flex items-center justify-center', isLooping ? 'text-[#FFD700]' : 'text-[#B3B3B3]')}
            >
              <Repeat className="w-6 h-6" />
              {isLooping && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />}
            </button>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between px-1">
            <button className="text-[#B3B3B3] active:opacity-60 w-10 h-10 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </button>
            {currentSong.hasLyrics && (
              <span className="text-[11px] font-bold text-[#A7A7A7] border border-[#A7A7A7]/40 rounded-full px-3 py-1">
                Lyrics
              </span>
            )}
            <div className="w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
