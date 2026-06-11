'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Music, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RightPlayer() {
  const { currentSong, isPlaying, togglePlay, progress, duration, toggleLoop, isLooping, toggleShuffle, isShuffling, next, previous, setProgress } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();

  if (!currentSong) {
    return (
      <aside className="hidden xl:flex flex-col w-[340px] h-full bg-[#05050f] border-l border-white/5 p-6 pb-[72px] shrink-0">
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Queue is empty</h3>
          <p className="text-sm text-white/60">Play a song to see details here</p>
        </div>
      </aside>
    );
  }

  const liked = isLiked(currentSong.id);
  const img = currentSong.image?.[2]?.url || currentSong.image?.[0]?.url;
  const artistNames = currentSong.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist';
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside className="hidden xl:flex flex-col w-[340px] h-full bg-[#05050f] border-l border-white/5 overflow-y-auto pb-[72px] shrink-0">
      
      {/* Immersive header area */}
      <div className="p-6 pb-0 flex justify-between items-center relative z-10">
        <span className="text-white font-bold text-sm">Now Playing</span>
        <button className="text-white/60 hover:text-white transition">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="px-6 mt-6 relative group">
        {/* Glowing backdrop matching album art (Optimized) */}
        <div 
          className="absolute inset-6 bg-cover bg-center opacity-30 rounded-3xl scale-110 -z-10 group-hover:opacity-50 transition-opacity duration-700"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className="absolute inset-6 bg-[#05050f]/50 rounded-3xl scale-110 -z-10"></div>
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
          <img src={img} alt={currentSong.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      </div>

      <div className="px-6 mt-8 flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-2xl font-bold text-white truncate drop-shadow-md">{currentSong.name}</h2>
          <p className="text-sm text-white/70 truncate mt-1 flex items-center gap-1">
            {artistNames}
            <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">✓</span>
          </p>
        </div>
        <button 
          onClick={() => toggleLike(currentSong)}
          className={cn("transition shrink-0 p-2 rounded-full hover:bg-white/10", liked ? "text-secondary" : "text-white/40 hover:text-white")}
        >
          <Heart className={cn("w-6 h-6", liked ? "fill-current drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" : "")} />
        </button>
      </div>

      {/* Progress Bar (Right Sidebar style) */}
      <div className="px-6 mt-6">
        <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium mb-2 justify-between">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative cursor-pointer"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const pct = (e.clientX - rect.left) / rect.width;
               setProgress(pct * duration);
               const audio = (window as any).__audioElement;
               if (audio) audio.currentTime = pct * duration;
             }}>
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
               style={{ width: `${progressPct}%` }}>
             {/* Glow dot */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />     
          </div>
        </div>
      </div>

      {/* Big Controls */}
      <div className="px-6 mt-8 flex items-center justify-between">
        <button onClick={toggleShuffle} className={cn("transition", isShuffling ? "text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "text-white/40 hover:text-white")}>
          <Shuffle className="w-5 h-5" />
        </button>
        <button onClick={previous} className="text-white hover:scale-110 transition drop-shadow-md">
          <SkipBack className="w-7 h-7 fill-current" />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:shadow-primary/60 transition hover:scale-105"
        >
          {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
        </button>
        <button onClick={next} className="text-white hover:scale-110 transition drop-shadow-md">
          <SkipForward className="w-7 h-7 fill-current" />
        </button>
        <button onClick={toggleLoop} className={cn("transition", isLooping ? "text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "text-white/40 hover:text-white")}>
          <Repeat className="w-5 h-5" />
        </button>
      </div>


    </aside>
  );
}
