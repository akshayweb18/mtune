'use client';

import { useState } from 'react';
import { Heart, Plus, ListMusic, Disc, Mic2, Play, MoreVertical, Clock, ListPlus } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { cn } from '@/lib/utils';
import { Song } from '@/types';
import { AddToPlaylistModal } from '@/components/shared/AddToPlaylistModal';
import { CreatePlaylistModal } from '@/components/shared/CreatePlaylistModal';
import Link from 'next/link';

const tabs = ['Liked Songs', 'History', 'Playlists', 'Artists'];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('Liked Songs');
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const { likedSongs, recentSongs, customPlaylists } = useLibraryStore();
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
              <div className="flex items-center">
                <button 
                  className="text-white/40 hover:text-white p-2 transition shrink-0 touch-sm active:scale-90" 
                  onClick={(e) => { e.stopPropagation(); setSelectedSongForPlaylist(song); }}
                >
                  <ListPlus className="w-5 h-5" />
                </button>
                <button className="text-white/40 hover:text-white p-2 transition shrink-0 touch-sm" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col" style={{ paddingTop: 'max(env(safe-area-inset-top, 16px), 16px)' }}>

      {/* Header */}
      <div className="px-4 md:px-8 pt-4 pb-4 flex items-center justify-between">
        <h1 className="text-[22px] md:text-[26px] font-black text-white tracking-tight">Your Library</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-[#B3B3B3] hover:text-white transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tab Filter Pills */}
      <div className="flex gap-2 px-4 md:px-8 mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors duration-150',
                isActive
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-8 pb-8">
        {activeTab === 'Liked Songs' && (
          <div>
            {/* Liked Songs hero */}
            <div className="flex items-center gap-4 p-4 mb-4">
              <div className="w-20 h-20 rounded-sm flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #450af5, #c4efd9)' }}>
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-1">Playlist</p>
                <h2 className="text-[28px] font-black text-white">Liked Songs</h2>
                <p className="text-[13px] text-[#A7A7A7] mt-1">{likedSongs.length} songs</p>
              </div>
            </div>
            {likedSongs.length > 0 && (
              <div className="flex items-center gap-4 px-4 mb-4">
                <button
                  onClick={handlePlayAllLiked}
                  className="w-14 h-14 rounded-full bg-[#FFD700] flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              </div>
            )}
            {renderSongList(likedSongs)}
          </div>
        )}

        {activeTab === 'History' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-white">Recently Played</h2>
              {recentSongs.length > 0 && (
                <button
                  onClick={handlePlayAllHistory}
                  className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center text-black hover:scale-105 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              )}
            </div>
            {renderSongList(recentSongs)}
          </div>
        )}

        {activeTab === 'Playlists' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-white">Playlists</h2>
              <button
                onClick={() => setIsCreatePlaylistOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-bold text-[13px] hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> New playlist
              </button>
            </div>

            {customPlaylists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mb-4">
                  <ListMusic className="w-9 h-9 text-[#B3B3B3]" />
                </div>
                <h2 className="text-[18px] font-bold text-white mb-2">Create your first playlist</h2>
                <p className="text-[#A7A7A7] text-[14px] mb-6">It's easy, we'll help you.</p>
                <button
                  onClick={() => setIsCreatePlaylistOpen(true)}
                  className="px-6 py-3 bg-white text-black font-bold rounded-full text-[14px] hover:scale-105 transition-transform"
                >
                  Create playlist
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {customPlaylists.map(playlist => (
                  <Link
                    href={`/playlist/${playlist.id}`}
                    key={playlist.id}
                    className="p-3 bg-[#181818] hover:bg-[#282828] rounded-md transition-colors group cursor-pointer"
                  >
                    <div className="w-full aspect-square rounded-sm overflow-hidden mb-3 bg-[#282828] shadow-lg relative flex items-center justify-center">
                      {playlist.songs.length > 0 ? (
                        <div className="grid grid-cols-2 w-full h-full">
                          {Array.from({ length: Math.min(4, playlist.songs.length) }).map((_, i) => {
                            const songImg = playlist.songs[i]?.image?.[1]?.url || playlist.songs[i]?.image?.[0]?.url;
                            return songImg ? <img key={i} src={songImg} alt="" className="w-full h-full object-cover" /> : null;
                          })}
                        </div>
                      ) : (
                        <ListMusic className="w-10 h-10 text-[#B3B3B3]" />
                      )}
                      {/* Floating play button */}
                      <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-white truncate text-[14px]">{playlist.name}</h3>
                    <p className="text-[#A7A7A7] text-[12px] mt-0.5">Playlist · {playlist.songs.length} songs</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Artists' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mb-4">
              <Mic2 className="w-9 h-9 text-[#B3B3B3]" />
            </div>
            <h2 className="text-[18px] font-bold text-white mb-2">No artists followed yet</h2>
            <p className="text-[#A7A7A7] text-[14px]">Follow artists to see them here.</p>
          </div>
        )}
      </div>

      <AddToPlaylistModal 
        isOpen={!!selectedSongForPlaylist} 
        onClose={() => setSelectedSongForPlaylist(null)} 
        song={selectedSongForPlaylist} 
      />
      <CreatePlaylistModal 
        isOpen={isCreatePlaylistOpen} 
        onClose={() => setIsCreatePlaylistOpen(false)} 
      />
    </div>
  );
}
