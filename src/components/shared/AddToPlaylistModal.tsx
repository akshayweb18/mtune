'use client';

import { X, Plus, Music, Check } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Song } from '@/types';
import { CreatePlaylistModal } from './CreatePlaylistModal';
import { useState } from 'react';
import { showToast } from './Toast';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export function AddToPlaylistModal({ isOpen, onClose, song }: AddToPlaylistModalProps) {
  const customPlaylists = useLibraryStore(s => s.customPlaylists);
  const addSongToPlaylist = useLibraryStore(s => s.addSongToPlaylist);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!isOpen || !song) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song!);
    const pl = customPlaylists.find(p => p.id === playlistId);
    showToast(`Added to "${pl?.name || 'playlist'}"`, 'success');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[#0A0A10] w-full max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden border-t sm:border border-white/10 shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
          
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-white">Add to Playlist</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition p-1 touch-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 scrollbar-hide">
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition">
                <Plus className="w-6 h-6 text-white/50 group-hover:text-primary transition" />
              </div>
              <span className="font-medium text-white group-hover:text-primary transition">New Playlist</span>
            </button>

            <div className="my-2 h-[1px] bg-white/5 mx-3" />

            {customPlaylists.length === 0 ? (
              <div className="py-8 text-center text-white/40 flex flex-col items-center gap-2">
                <Music className="w-8 h-8 opacity-50" />
                <p className="text-sm">No custom playlists yet</p>
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {customPlaylists.map(playlist => {
                  const songExists = playlist.songs.some(s => s.id === song.id);
                  
                  return (
                    <button
                      key={playlist.id}
                      onClick={() => !songExists && handleAddToPlaylist(playlist.id)}
                      disabled={songExists}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left disabled:opacity-50 disabled:hover:bg-transparent group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {playlist.songs.length > 0 ? (
                          <img 
                            src={playlist.songs[0].image?.[2]?.url || playlist.songs[0].image?.[0]?.url} 
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-white truncate">{playlist.name}</span>
                        <span className="text-xs text-white/50">{playlist.songs.length} songs</span>
                      </div>
                      {songExists && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary pr-2">Added</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CreatePlaylistModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={(id) => handleAddToPlaylist(id)}
      />
    </>
  );
}
