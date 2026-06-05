'use client';

import { History, Clock, Play, MoreVertical, Trash2 } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function HistoryPage() {
  const recentSongs = useLibraryStore((s) => s.recentSongs);
  const clearHistory = useLibraryStore((s) => s.clearHistory);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const currentSong = usePlayerStore((s) => s.currentSong);

  const handlePlaySong = (song: any, index: number) => {
    setCurrentSong(song);
    setQueue(recentSongs); // Queue the whole history list
    if (!isPlaying) togglePlay();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto mb-24 md:mb-0">
      <div className="glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/30 blur-[80px] rounded-full" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Recently Played</h1>
              <p className="text-white/60 mt-1">Your listening history • {recentSongs.length} songs</p>
            </div>
          </div>
          
          {recentSongs.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {recentSongs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No history yet</h2>
          <p className="text-white/40 text-sm">Start playing songs to build your history!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentSongs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            
            return (
              <div 
                key={`${song.id}-${index}`}
                onClick={() => handlePlaySong(song, index)}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group ${isCurrent ? 'bg-white/10 border-white/10' : 'hover:bg-white/5 border-transparent'} border`}
              >
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src={song.image?.[2]?.url || song.image?.[0]?.url || ''} 
                    alt={song.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isCurrent && isPlaying ? (
                       <div className="w-4 h-4 flex items-end justify-center gap-[2px]">
                         <div className="w-1 bg-primary h-full animate-[bounce_1s_infinite]" />
                         <div className="w-1 bg-primary h-2/3 animate-[bounce_1s_infinite_0.2s]" />
                         <div className="w-1 bg-primary h-4/5 animate-[bounce_1s_infinite_0.4s]" />
                       </div>
                    ) : (
                       <Play className={`w-5 h-5 fill-white text-white ${isCurrent ? 'text-primary fill-primary' : ''}`} />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className={`text-[15px] font-bold truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>{song.name}</h4>
                  <span className="text-[13px] text-white/50 truncate mt-0.5">
                    {song.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist'}
                  </span>
                </div>
                
                <div className="hidden md:flex items-center w-24 text-[13px] text-white/40 font-medium">
                  {formatTime(song.duration)}
                </div>
                
                <button className="p-2 text-white/30 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
