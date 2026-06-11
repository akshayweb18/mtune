'use client';

import { useQuery } from '@tanstack/react-query';
import { saavnApi } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, Heart, Compass } from 'lucide-react';
import { Song } from '@/types';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/store/useLibraryStore';

export default function DiscoverPage() {
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLibraryStore();

  const { data: discoverData, isLoading } = useQuery({
    queryKey: ['discover-global'],
    queryFn: () => saavnApi.searchSongs('viral', 1, 30),
  });

  const songs: Song[] = discoverData?.results || [];

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
        <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      
      {/* Immersive Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-end p-6 md:p-10 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 via-emerald-600/10 to-[#05050f] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] to-transparent z-0"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal-500/20 blur-[60px] rounded-full opacity-60 z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 w-full">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.5)] shrink-0 border border-white/20">
             <Compass className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-md" />
          </div>
          <div className="flex flex-col flex-1 pb-2">
            <span className="text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">Made For You</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4">Discover</h1>
            <p className="text-white/60 text-sm md:text-base font-medium">New music based on your taste.</p>
          </div>
        </div>

        {/* Floating Play Button */}
        <div className="absolute -bottom-8 right-8 z-20">
           <button 
             onClick={handlePlayAll}
             className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:scale-105 active:scale-95 transition-all"
           >
             <Play className="w-8 h-8 fill-current ml-1.5" />
           </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 md:px-10 pt-12 max-w-5xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
          {songs.map((song, index) => {
            const isActive = currentSong?.id === song.id;
            const isLikedSong = isLiked(song.id);
            return (
              <div 
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
                className="flex items-center p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5">
                  <img src={song.image?.[2]?.url || song.image?.[0]?.url} alt={song.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    {isActive && isPlaying ? <Pause className="w-5 h-5 fill-white text-white" /> : <Play className="w-5 h-5 fill-white text-white ml-0.5" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center px-4">
                  <h4 className={cn("text-[14px] md:text-[15px] font-bold truncate transition-colors", isActive ? "text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "text-white group-hover:text-teal-300")}>
                    {song.name}
                  </h4>
                  <p className="text-[12px] md:text-[13px] text-white/50 truncate font-medium mt-0.5">
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
