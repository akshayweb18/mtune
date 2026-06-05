'use client';

import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, Heart, Flame, Music } from 'lucide-react';
import { Song } from '@/types';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/store/useLibraryStore';

export default function TrendingPage() {
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();

  const { data: trendingData, isLoading } = useQuery({
    queryKey: ['trending-global-2024'],
    queryFn: () => saavnApi.searchSongs('top hindi songs 2024', 1, 30),
  });

  const songs: Song[] = trendingData?.results || [];

  const handlePlaySong = (song: Song, index: number) => {
    setCurrentSong(song);
    setQueue(songs.slice(index));
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      handlePlaySong(songs[0], 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#05050f]">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#05050f] pb-[120px]">
      
      {/* Immersive Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-end p-6 md:p-10 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-red-600/10 to-[#05050f] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] to-transparent z-0"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/20 blur-[60px] rounded-full opacity-60 z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 w-full">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)] shrink-0 border border-white/20">
             <Flame className="w-16 h-16 md:w-24 md:h-24 text-white fill-white drop-shadow-md" />
          </div>
          <div className="flex flex-col flex-1 pb-2">
            <span className="text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">Global Chart</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4">Trending Now</h1>
            <p className="text-white/60 text-sm md:text-base font-medium">The most played tracks right now.</p>
          </div>
        </div>

        {/* Floating Play Button */}
        <div className="absolute -bottom-8 right-8 z-20">
           <button 
             onClick={handlePlayAll}
             className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-105 active:scale-95 transition-all"
           >
             <Play className="w-8 h-8 fill-current ml-1.5" />
           </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 md:px-10 pt-12 max-w-5xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col gap-1">
          {songs.map((song, index) => {
            const isActive = currentSong?.id === song.id;
            const isLikedSong = isLiked(song.id);
            return (
              <div 
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
                className="flex items-center p-2 md:p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="w-8 flex justify-center shrink-0 text-white/50 text-sm font-bold">
                  {isActive && isPlaying ? (
                    <div className="flex items-end justify-center gap-[3px] h-4">
                      <div className="w-1 h-3 bg-orange-500 animate-[eq-bar_1s_infinite]" />
                      <div className="w-1 h-4 bg-orange-500 animate-[eq-bar_1s_infinite_0.2s]" />
                      <div className="w-1 h-2 bg-orange-500 animate-[eq-bar_1s_infinite_0.4s]" />
                    </div>
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  {!isActive && <Play className="w-4 h-4 text-white fill-current hidden group-hover:block drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                </div>

                <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 mx-3 shadow-md border border-white/5">
                  <img src={song.image?.[2]?.url || song.image?.[0]?.url} alt={song.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center pr-4">
                  <h4 className={cn("text-[14px] md:text-base font-bold truncate transition-colors", isActive ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "text-white group-hover:text-orange-400")}>
                    {song.name}
                  </h4>
                  <p className="text-[12px] md:text-[13px] text-white/50 truncate font-medium">
                    {song.artists?.primary?.map((a: any) => a.name).join(', ') || 'Unknown Artist'}
                  </p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                  className="shrink-0 p-2 text-white/40 hover:text-white hover:scale-110 transition-all"
                >
                  <Heart className={cn("w-5 h-5 transition-colors", isLikedSong ? "fill-secondary text-secondary drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" : "")} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
