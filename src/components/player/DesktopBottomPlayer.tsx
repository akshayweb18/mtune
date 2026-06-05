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
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 h-[100px] bg-[#0A0A10] border-t border-white/5 z-[100] px-6 items-center justify-between">
      
      {/* Center: Progress & Controls */}
      <div className="flex items-center flex-1 max-w-[50%] justify-center gap-8">
        
        {/* Left Side: Song Info Mini */}
        <div className="flex items-center gap-4 shrink-0 w-[200px]">
          <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg border border-white/10 shrink-0">
            <img src={currentSong.image?.[1]?.url || currentSong.image?.[0]?.url} alt={currentSong.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col truncate min-w-0">
            <h4 className="text-[15px] font-bold text-white truncate">{currentSong.name}</h4>
            <p className="text-xs text-white/60 truncate mt-0.5">{currentSong.artists?.primary?.map(a => a.name).join(', ')}</p>
          </div>
          <button 
            onClick={() => toggleLike(currentSong)} 
            className={cn("shrink-0", liked ? "text-secondary" : "text-white/40 hover:text-white")}
          >
            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Center: Waveform + Progress */}
        <div className="flex-1 flex flex-col items-center max-w-[600px] w-full">
           {/* Static waveform - no Math.random() in render */}
           <div className="h-6 w-full flex items-center justify-center gap-0.5 opacity-20 mb-2 overflow-hidden">
             {WAVEFORM_BARS.map((h, i) => (
               <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${h}%` }} />
             ))}
           </div>
           
           <div className="flex items-center gap-3 w-full">
             <span className="text-[11px] text-white/50 font-medium w-10 text-right">{formatTime(progress)}</span>
             <div ref={progressBarRef} onClick={handleProgressClick} className="flex-1 h-6 rounded-full cursor-pointer group relative flex items-center">
               <div className="w-full h-1.5 bg-white/10 rounded-full absolute" />
               <div className="h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full absolute" style={{ width: `${progressPct}%` }} />
               <div className="absolute w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_12px_#fff]" style={{ left: `calc(${progressPct}% - 7px)` }} />
             </div>
             <span className="text-[11px] text-white/50 font-medium w-10 text-left">{formatTime(duration)}</span>
           </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-5 shrink-0 pl-6">
          <button onClick={previous} className="text-white hover:scale-110 active:scale-95">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95">
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <button onClick={next} className="text-white hover:scale-110 active:scale-95">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-5 w-[250px] shrink-0">
        <button className="text-white/40 hover:text-white">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-white/40 hover:text-white">
          <MonitorSpeaker className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-white/40 hover:text-white shrink-0">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div ref={volumeBarRef} onClick={handleVolumeClick} className="w-20 h-6 rounded-full cursor-pointer group relative flex items-center">
            <div className="w-full h-1.5 bg-white/10 rounded-full absolute" />
            <div className="h-1.5 bg-white group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary rounded-full absolute" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
          </div>
        </div>
        <button className="text-white/40 hover:text-white pl-2 border-l border-white/10">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
    </div>
  );
}
