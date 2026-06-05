'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, SkipBack, SkipForward, MoreVertical, Heart, Shuffle, Repeat, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';

export function MobilePlayer() {
  // Use individual selectors for minimal re-renders
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const isExpanded = usePlayerStore((s) => s.isExpanded);
  const setExpanded = usePlayerStore((s) => s.setExpanded);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const isShuffling = usePlayerStore((s) => s.isShuffling);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const isLooping = usePlayerStore((s) => s.isLooping);
  const toggleLoop = usePlayerStore((s) => s.toggleLoop);
  const { isLiked, toggleLike } = useLibraryStore();

  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!currentSong) return null;

  const liked = isLiked(currentSong.id);
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const img = currentSong.image?.[2]?.url || currentSong.image?.[0]?.url;
  const artistNames = currentSong.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist';

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

  // Mini Player — ultra lightweight, NO backdrop-blur
  if (!isExpanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        className="md:hidden fixed bottom-[70px] left-2 right-2 h-[60px] bg-[#1a1a2e] border border-white/10 rounded-2xl z-40 flex items-center px-3 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0 border border-white/5">
          <img src={img} alt={currentSong.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0 px-3">
          <span className="text-[13px] font-bold text-white truncate block">{currentSong.name}</span>
          <span className="text-[11px] text-white/60 truncate block">{artistNames}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 shrink-0"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>
        {/* Progress Line */}
        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    );
  }

  // Expanded Full Screen Player — NO blur, just dark overlay on background image
  return (
    <div className="md:hidden fixed inset-0 z-[100] bg-[#05050f] flex flex-col pb-safe relative overflow-hidden">

      {/* Background image with dark overlay — NO blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 z-0"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A10]/50 via-[#0A0A10]/90 to-[#0A0A10] z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button onClick={() => setExpanded(false)} className="text-white p-2 -ml-2 active:scale-90">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span className="text-white text-xs font-bold tracking-widest uppercase opacity-80">Now Playing</span>
        <button className="text-white p-2 -mr-2">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {/* Album Art */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pb-4 max-h-[50vh]">
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
          <img src={img} alt={currentSong.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      {/* Controls & Info */}
      <div className="relative z-10 px-8 pb-8 pt-4 flex flex-col gap-6">

        {/* Title & Like */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col flex-1 min-w-0 pr-4">
            <h2 className="text-2xl font-extrabold text-white truncate">{currentSong.name}</h2>
            <p className="text-white/70 text-sm font-medium truncate mt-1 flex items-center gap-1">
              {artistNames}
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white ml-1">✓</span>
            </p>
          </div>
          <button
            onClick={() => toggleLike(currentSong)}
            className="shrink-0 active:scale-90 p-2 -mr-2"
          >
            <Heart className={cn("w-7 h-7", liked ? "fill-secondary text-secondary" : "text-white")} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="w-full h-6 relative cursor-pointer flex items-center"
          >
            <div className="w-full h-1.5 bg-white/20 rounded-full absolute" />
            <div
              className="absolute h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{ width: `${progressPct}%` }}
            />
            <div className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_8px_#fff]" style={{ left: `calc(${progressPct}% - 7px)` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between px-2">
          <button onClick={toggleShuffle} className={cn(isShuffling ? "text-primary" : "text-white/60")}>
            <Shuffle className="w-6 h-6" />
          </button>
          <button onClick={previous} className="text-white active:scale-90">
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/40 active:scale-95"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          <button onClick={next} className="text-white active:scale-90">
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
          <button onClick={toggleLoop} className={cn(isLooping ? "text-primary" : "text-white/60")}>
            <Repeat className="w-6 h-6" />
          </button>
        </div>



      </div>
    </div>
  );
}
