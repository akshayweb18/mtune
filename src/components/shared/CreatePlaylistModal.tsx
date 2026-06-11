'use client';

import { useState } from 'react';
import { X, Music } from 'lucide-react';
import { useLibraryStore } from '@/store/useLibraryStore';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (playlistId: string) => void;
}

export function CreatePlaylistModal({ isOpen, onClose, onSuccess }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const createPlaylist = useLibraryStore(s => s.createPlaylist);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const id = createPlaylist(name.trim());
    setName('');
    if (onSuccess) onSuccess(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0A0A10] w-full max-w-sm p-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          Create Playlist
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome playlist"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all mb-6"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold disabled:opacity-50 transition shadow-lg shadow-primary/20"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
