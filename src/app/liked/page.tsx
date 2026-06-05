'use client';

import { Heart, Play, Pause, Shuffle, MoreVertical, Clock } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';

export default function LikedSongsPage() {
  const { likedSongs, toggleLike } = useLibraryStore();
  const { setCurrentSong, setQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();

  const handlePlaySong = (song: any, index: number) => {
    setCurrentSong(song);
    setQueue(likedSongs.slice(index));
  };

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      if (currentSong && likedSongs.some(s => s.id === currentSong.id)) {
        togglePlay();
      } else {
        handlePlaySong(likedSongs[0], 0);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#05050f] pb-[120px]">
      {/* Immersive Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-end p-6 md:p-10 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-3xl opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] to-transparent z-0"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full opacity-60 z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 w-full">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)] shrink-0 border border-white/20 relative group">
             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl mix-blend-overlay"></div>
             <Heart className="w-16 h-16 md:w-24 md:h-24 text-white fill-white drop-shadow-md" />
          </div>
          <div className="flex flex-col flex-1 pb-2">
            <span className="text-white/80 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">Playlist</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4">Liked Songs</h1>
            <p className="text-white/60 text-sm md:text-base font-medium flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">A</span>
               Akshay • {likedSongs.length} songs
            </p>
          </div>
        </div>

        {/* Floating Neon Play Button */}
        <div className="absolute -bottom-8 right-8 z-20">
           <button 
             onClick={handlePlayAll}
             className={cn("w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all", likedSongs.length > 0 ? "bg-gradient-to-br from-secondary to-primary" : "bg-white/10 opacity-50 cursor-not-allowed")}
             disabled={likedSongs.length === 0}
           >
             {isPlaying && currentSong && likedSongs.some(s => s.id === currentSong.id) ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1.5" />}
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 pt-12 max-w-5xl animate-in slide-in-from-bottom-8 duration-500">
        {likedSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <Heart className="w-16 h-16 text-white/20 mb-4" />
             <h2 className="text-2xl font-bold text-white mb-2">Songs you like will appear here</h2>
             <p className="text-white/50 text-sm">Save songs by tapping the heart icon.</p>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-wider px-2 md:px-4 pb-4 border-b border-white/10 mb-4">
              <div className="w-8 text-center">#</div>
              <div className="flex-1">Title</div>
              <div className="w-16 text-right hidden md:block"><Clock className="w-4 h-4 ml-auto" /></div>
            </div>

            <div className="flex flex-col gap-1">
              {likedSongs.map((song, index) => {
                const isActive = currentSong?.id === song.id;
                const songImg = song.image?.[1]?.url || song.image?.[0]?.url;
                
                return (
                  <div 
                    key={song.id}
                    onClick={() => handlePlaySong(song, index)}
                    className="flex items-center p-2 md:p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 flex justify-center shrink-0 text-white/50 text-sm font-bold">
                      {isActive && isPlaying ? (
                        <div className="flex items-end justify-center gap-[3px] h-4">
                          <div className="w-1 h-3 bg-secondary animate-[eq-bar_1s_infinite]" />
                          <div className="w-1 h-4 bg-secondary animate-[eq-bar_1s_infinite_0.2s]" />
                          <div className="w-1 h-2 bg-secondary animate-[eq-bar_1s_infinite_0.4s]" />
                        </div>
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {!isActive && <Play className="w-4 h-4 text-white fill-current hidden group-hover:block drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                    </div>

                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-md overflow-hidden shrink-0 mx-3 shadow-md border border-white/5">
                      <img src={songImg} alt={song.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"></div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center pr-4">
                      <h4 className={cn("text-[14px] md:text-base font-bold truncate transition-colors", isActive ? "text-secondary drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" : "text-white group-hover:text-primary")}>
                        {song.name}
                      </h4>
                      <p className="text-[12px] md:text-[13px] text-white/50 truncate font-medium">
                        {song.artists?.primary?.map((a: any) => a.name).join(', ') || 'Unknown Artist'}
                      </p>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                      className="shrink-0 p-2 text-secondary hover:scale-110 transition-transform"
                    >
                      <Heart className="w-5 h-5 fill-current drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
                    </button>

                    <div className="w-16 text-right hidden md:block text-xs text-white/40 font-medium">
                      {Math.floor((song.duration || 0) / 60)}:{String((song.duration || 0) % 60).padStart(2, '0')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
