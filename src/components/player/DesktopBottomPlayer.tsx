'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Heart, ListMusic, Mic2, Maximize2
} from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export function DesktopBottomPlayer() {
  const currentSong   = usePlayerStore((s) => s.currentSong);
  const isPlaying     = usePlayerStore((s) => s.isPlaying);
  const togglePlay    = usePlayerStore((s) => s.togglePlay);
  const volume        = usePlayerStore((s) => s.volume);
  const setVolume     = usePlayerStore((s) => s.setVolume);
  const isMuted       = usePlayerStore((s) => s.isMuted);
  const toggleMute    = usePlayerStore((s) => s.toggleMute);
  const progress      = usePlayerStore((s) => s.progress);
  const duration      = usePlayerStore((s) => s.duration);
  const setProgress   = usePlayerStore((s) => s.setProgress);
  const next          = usePlayerStore((s) => s.next);
  const previous      = usePlayerStore((s) => s.previous);
  const isLooping     = usePlayerStore((s) => s.isLooping);
  const toggleLoop    = usePlayerStore((s) => s.toggleLoop);
  const isShuffling   = usePlayerStore((s) => s.isShuffling);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const { isLiked, toggleLike } = useLibraryStore();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef   = useRef<HTMLDivElement>(null);

  if (!currentSong) return null;

  const liked       = isLiked(currentSong.id);
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const volumePct   = (isMuted ? 0 : volume) * 100;

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    setProgress(newTime);
    const audio = (window as any).__audioElement;
    if (audio) audio.currentTime = newTime;
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
    if (isMuted && pct > 0) toggleMute();
  };

  const img = currentSong.image?.[1]?.url || currentSong.image?.[0]?.url;

  return (
    <div
      className="hidden md:flex fixed bottom-0 left-0 right-0 h-[90px] z-[100] px-4 items-center"
      style={{
        background: '#181818',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* ── Left: Song Info ── */}
      <div className="flex items-center gap-3 w-[280px] shrink-0 min-w-0">
        <div className="w-14 h-14 rounded-sm overflow-hidden shrink-0 shadow-lg">
          {img && (
            <img src={img} alt={currentSong.name} className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-[13px] font-bold text-white truncate hover:underline cursor-pointer">
            {currentSong.name}
          </h4>
          <p className="text-[11px] text-[#A7A7A7] truncate hover:underline cursor-pointer mt-0.5">
            {currentSong.artists?.primary?.map(a => a.name).join(', ')}
          </p>
        </div>

        <button
          onClick={() => toggleLike(currentSong)}
          className={cn('shrink-0 p-1.5 transition-all hover:scale-110', liked ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
        >
          <Heart className={cn('w-4 h-4', liked ? 'fill-current' : '')} />
        </button>
      </div>

      {/* ── Center: Controls + Progress ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 min-w-0 px-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={cn('transition-all hover:scale-105 relative', isShuffling ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffling && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />}
          </button>

          <button onClick={previous} className="text-[#A7A7A7] hover:text-white hover:scale-105 transition-all">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[#FFD700] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button onClick={next} className="text-[#A7A7A7] hover:text-white hover:scale-105 transition-all">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleLoop}
            className={cn('transition-all hover:scale-105 relative', isLooping ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
          >
            <Repeat className="w-4 h-4" />
            {isLooping && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full max-w-[560px]">
          <span className="text-[11px] text-[#A7A7A7] w-8 text-right shrink-0 tabular-nums">{fmt(progress)}</span>
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            onMouseMove={(e) => { if (e.buttons === 1) handleProgressClick(e); }}
            className="flex-1 h-4 rounded-full cursor-pointer group relative flex items-center"
          >
            <div className="w-full h-[4px] bg-[#4D4D4D] rounded-full absolute" />
            <div
              className="h-[4px] bg-white group-hover:bg-[#FFD700] rounded-full absolute transition-colors duration-150"
              style={{ width: `${progressPct}%` }}
            />
            <div
              className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow transition-opacity -translate-x-1/2"
              style={{ left: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] text-[#A7A7A7] w-8 shrink-0 tabular-nums">{fmt(duration)}</span>
        </div>
      </div>

      {/* ── Right: Volume & Extras ── */}
      <div className="flex items-center justify-end gap-3 w-[280px] shrink-0">
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-[#A7A7A7] hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div
            ref={volumeBarRef}
            onClick={handleVolumeClick}
            className="w-[90px] h-4 rounded-full cursor-pointer group relative flex items-center"
          >
            <div className="w-full h-[4px] bg-[#4D4D4D] rounded-full absolute" />
            <div
              className="h-[4px] bg-white group-hover:bg-[#1ED760] rounded-full absolute transition-colors duration-150"
              style={{ width: `${volumePct}%` }}
            />
            <div
              className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow transition-opacity -translate-x-1/2"
              style={{ left: `${volumePct}%` }}
            />
          </div>
        </div>

        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
