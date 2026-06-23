'use client';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Music, ListMusic } from 'lucide-react';
import { cn, decodeHtml } from '@/lib/utils';

export function RightPlayer() {
  const { currentSong, isPlaying, togglePlay, progress, duration, toggleLoop, isLooping, toggleShuffle, isShuffling, next, previous, setProgress } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();

  const isOpen = !!currentSong;

  // Safe defaults for when currentSong is null (during closing animation)
  const liked = currentSong ? isLiked(currentSong.id) : false;
  const img = currentSong?.image?.[2]?.url || currentSong?.image?.[0]?.url;
  const artistNames = decodeHtml(currentSong?.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist');
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={cn(
        "hidden xl:flex h-full transition-[width] duration-500 ease-in-out overflow-hidden shrink-0",
        isOpen ? "w-[320px]" : "w-0"
      )}
    >
      <aside
        className={cn(
          "flex flex-col w-[320px] h-full bg-[#121212] border-l border-white/[0.06] overflow-y-auto pb-[110px] shrink-0 scrollbar-hide transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {currentSong && (
          <div className="flex flex-col w-full h-full">
            {/* Header */}
            <div className="px-4 pt-5 pb-2 flex items-center justify-between">
              <span className="text-[13px] font-bold text-white">Now playing</span>
              <button className="text-[#A7A7A7] hover:text-white transition-colors">
                <ListMusic className="w-4 h-4" />
              </button>
            </div>

            {/* Album Art */}
            <div className="px-4 mt-2">
              <div className="w-full aspect-square rounded-sm overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                {img ? (
                  <img src={img} alt={currentSong.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-[#282828]" />
                )}
              </div>
            </div>

            {/* Song Info + Like */}
            <div className="px-4 mt-5 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold text-white truncate hover:underline cursor-pointer">{decodeHtml(currentSong.name)}</h2>
                <p className="text-[13px] text-[#A7A7A7] truncate hover:underline cursor-pointer mt-0.5">{artistNames}</p>
              </div>
              <button
                onClick={() => toggleLike(currentSong)}
                className={cn('p-1.5 shrink-0 transition-all hover:scale-110', liked ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
              >
                <Heart className={cn('w-5 h-5', liked ? 'fill-current' : '')} />
              </button>
            </div>

            {/* Progress */}
            <div className="px-4 mt-5">
              <div
                className="w-full h-4 flex items-center cursor-pointer group relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setProgress(pct * duration);
                  const audio = (window as any).__audioElement;
                  if (audio) audio.currentTime = pct * duration;
                }}
              >
                <div className="w-full h-[4px] bg-[#4D4D4D] rounded-full absolute" />
                <div
                  className="h-[4px] bg-white group-hover:bg-[#FFD700] rounded-full absolute transition-colors duration-150"
                  style={{ width: `${progressPct}%` }}
                />
                <div
                  className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 -translate-x-1/2"
                  style={{ left: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-[#A7A7A7] tabular-nums">{fmt(progress)}</span>
                <span className="text-[11px] text-[#A7A7A7] tabular-nums">{fmt(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="px-4 mt-5 flex items-center justify-between">
              <button
                onClick={toggleShuffle}
                className={cn('transition-all hover:scale-110 relative', isShuffling ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
              >
                <Shuffle className="w-5 h-5" />
                {isShuffling && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />}
              </button>

              <button onClick={previous} className="text-white hover:scale-110 transition-all">
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button onClick={next} className="text-white hover:scale-110 transition-all">
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={toggleLoop}
                className={cn('transition-all hover:scale-110 relative', isLooping ? 'text-[#FFD700]' : 'text-[#A7A7A7] hover:text-white')}
              >
                <Repeat className="w-5 h-5" />
                {isLooping && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
