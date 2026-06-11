'use client';

import { useState } from 'react';
import { Heart, Plus, ListMusic, Disc, Mic2, Play, MoreVertical, Clock } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';
import { Song } from '@/types';

const tabs = ['Liked Songs', 'History', 'Playlists', 'Artists'];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('Liked Songs');
  const { likedSongs, recentSongs } = useLibraryStore();
  const { currentSong, isPlaying, togglePlay, setQueue, setCurrentSong } = usePlayerStore();

  const handlePlaySong = (song: Song, queue: Song[]) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setQueue(queue);
      setCurrentSong(song);
    }
  };

  const handlePlayAllLiked = () => {
    if (likedSongs.length === 0) return;
    setQueue(likedSongs);
    setCurrentSong(likedSongs[0]);
  };

  const handlePlayAllHistory = () => {
    if (recentSongs.length === 0) return;
    setQueue(recentSongs);
    setCurrentSong(recentSongs[0]);
  };

  const renderSongList = (songs: Song[]) => {
    if (songs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <ListMusic className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No songs yet</h2>
          <p className="text-white/40 text-sm">Start listening to build your collection.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 animate-in fade-in duration-500 mt-2">
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;

          return (
            <div
              key={`${song.id}-${index}`}
              onClick={() => handlePlaySong(song, songs)}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-xl group hover:bg-white/5 active:scale-95 transition-all cursor-pointer border border-transparent",
                isCurrentSong ? "bg-white/10 border-white/10" : ""
              )}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                  <img src={song.image[2]?.url || song.image[1]?.url || song.image[0]?.url} alt={song.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className={cn(
                    "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                    isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <Play className={cn("w-4 h-4 fill-white text-white", isCurrentSong && isPlaying && "animate-pulse")} />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0 pr-2">
                  <span className={cn(
                    "text-[14px] font-bold truncate transition-colors",
                    isCurrentSong ? "text-primary" : "text-white"
                  )}>
                    {song.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&')}
                  </span>
                  <span className="text-[12px] text-white/50 font-medium mt-0.5 truncate">
                    {song.artists?.primary?.map(a => a.name).join(', ')}
                  </span>
                </div>
              </div>
              <button className="text-white/40 hover:text-white p-2 transition shrink-0 touch-sm" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col pt-safe px-4 md:px-8 max-w-4xl mx-auto min-h-full pb-6" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pt-2">
        <h1 className="text-[22px] md:text-2xl font-extrabold text-white tracking-tight">Your Library</h1>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden border-2 border-primary/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Tabs / Pills */}
      <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap snap-start transition-all",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeTab === 'Liked Songs' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center py-8 text-center bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-white/5 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 relative">
              <Heart className="w-8 h-8 text-secondary drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] fill-current" />
            </div>
            <h2 className="text-xl font-extrabold text-white mb-1">Liked Songs</h2>
            <p className="text-white/60 text-sm mb-4 font-medium">{likedSongs.length} songs</p>
            {likedSongs.length > 0 && (
              <button
                onClick={handlePlayAllLiked}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Play All
              </button>
            )}
          </div>
          {renderSongList(likedSongs)}
        </div>
      )}

      {activeTab === 'History' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-5 h-5" />
              <h2 className="font-bold">Recently Played</h2>
            </div>
            {recentSongs.length > 0 && (
              <button onClick={handlePlayAllHistory} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                Play All
              </button>
            )}
          </div>
          {renderSongList(recentSongs)}
        </div>
      )}

      {(activeTab === 'Playlists' || activeTab === 'Artists' || activeTab === 'Albums') && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            {activeTab === 'Playlists' ? <ListMusic className="w-8 h-8 text-white/40" /> : activeTab === 'Albums' ? <Disc className="w-8 h-8 text-white/40" /> : <Mic2 className="w-8 h-8 text-white/40" />}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No {activeTab} yet</h2>
          <p className="text-white/40 text-sm">When you add {activeTab.toLowerCase()}, they'll appear here.</p>
        </div>
      )}
    </div>
  );
}
