'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, MonitorSpeaker, Mic2 } from 'lucide-react';
import { useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

// Pre-generate static waveform heights so they don't regenerate on every render
const WAVEFORM_BARS = Array.from({ length: 40 }, (_, i) => 
  Math.max(20, Math.sin(i * 0.3) * 40 + 50 + (i % 3) * 10)
);

export function DesktopBottomPlayer() {
  // Use individual selectors to only re-render when specific values change
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const { isLiked, toggleLike } = useLibraryStore();
  
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  if (!currentSong) return null;

  const liked = isLiked(currentSong.id);
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    setProgress(newTime);
    const audio = (window as any).__audioElement;
    if (audio) audio.currentTime = newTime;
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
    if (isMuted && pct > 0) toggleMute();
  };

  return (
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 h-[72px] bg-[#0A0A10]/95 backdrop-blur-md border-t border-white/5 z-[100] px-4 items-center gap-4">
      
      {/* Left: Song Info */}
      <div className="flex items-center gap-3 w-[280px] shrink-0 min-w-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 shrink-0">
          <img src={currentSong.image?.[1]?.url || currentSong.image?.[0]?.url} alt={currentSong.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-[13px] font-bold text-white truncate">{currentSong.name}</h4>
          <p className="text-[11px] text-white/50 truncate mt-0.5">{currentSong.artists?.primary?.map(a => a.name).join(', ')}</p>
        </div>
        <button 
          onClick={() => toggleLike(currentSong)} 
          className={cn("shrink-0 p-1.5", liked ? "text-secondary" : "text-white/40 hover:text-white")}
        >
          <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Center: Controls + Progress */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0">
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button onClick={previous} className="text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button onClick={next} className="text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-2 w-full max-w-[500px]">
          <span className="text-[10px] text-white/40 font-medium w-8 text-right shrink-0">{formatTime(progress)}</span>
          <div ref={progressBarRef} onClick={handleProgressClick} className="flex-1 h-4 rounded-full cursor-pointer group relative flex items-center">
            <div className="w-full h-1 bg-white/10 rounded-full absolute" />
            <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full absolute" style={{ width: `${progressPct}%` }} />
            <div className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-opacity" style={{ left: `calc(${progressPct}% - 6px)` }} />
          </div>
          <span className="text-[10px] text-white/40 font-medium w-8 shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-3 w-[200px] shrink-0">
        <button className="text-white/30 hover:text-white transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-white/30 hover:text-white transition-colors">
          <MonitorSpeaker className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-white/40 hover:text-white shrink-0 transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div ref={volumeBarRef} onClick={handleVolumeClick} className="w-20 h-4 rounded-full cursor-pointer group relative flex items-center">
            <div className="w-full h-1 bg-white/10 rounded-full absolute" />
            <div className="h-1 bg-white group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary rounded-full absolute transition-colors" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
          </div>
        </div>
        <button className="text-white/30 hover:text-white pl-2 border-l border-white/10 transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
    </div>
  );
}
