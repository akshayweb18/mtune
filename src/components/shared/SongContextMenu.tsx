'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Heart, ListPlus, PlayCircle, ListMusic, Share2 } from 'lucide-react';
import { Song } from '@/types';
import { useLibraryStore } from '@/store/useLibraryStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import { showToast } from './Toast';
import { cn } from '@/lib/utils';

interface SongContextMenuProps {
  song: Song;
  queue?: Song[];
  className?: string;
  iconClassName?: string;
}

export function SongContextMenu({ song, queue = [], className, iconClassName }: SongContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLiked, toggleLike } = useLibraryStore();
  const { addToQueue, setCurrentSong, setQueue } = usePlayerStore();
  const liked = isLiked(song.id);

  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(song);
    showToast(liked ? 'Removed from Liked Songs' : 'Added to Liked Songs', 'success');
    setIsOpen(false);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    showToast(`Added "${song.name}" to queue`, 'success');
    setIsOpen(false);
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const store = usePlayerStore.getState();
    const currentQueue = store.queue;
    const currentSong = store.currentSong;
    if (!currentSong) {
      store.setCurrentSong(song);
      store.setQueue([song, ...queue]);
    } else {
      const idx = currentQueue.findIndex(s => s.id === currentSong.id);
      const newQueue = [...currentQueue];
      newQueue.splice(idx + 1, 0, song);
      store.setQueue(newQueue);
    }
    showToast(`"${song.name}" will play next`, 'success');
    setIsOpen(false);
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setShowPlaylistModal(true);
  };

  return (
    <div ref={menuRef} className={cn('relative', className)} onClick={e => e.stopPropagation()}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={cn(
          'flex items-center justify-center text-[#A7A7A7] hover:text-white transition-colors rounded-full hover:bg-white/10 active:scale-90',
          iconClassName || 'w-8 h-8'
        )}
        title="More options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-[200] min-w-[200px] bg-[#282828] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-fade-in"
          style={{ top: '110%', boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}
        >
          <button
            onClick={handleLike}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white hover:bg-white/10 transition-colors text-left"
          >
            <Heart className={cn('w-4 h-4 shrink-0', liked ? 'fill-[#FFD700] text-[#FFD700]' : '')} />
            {liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          </button>
          <button
            onClick={handleAddToPlaylist}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white hover:bg-white/10 transition-colors text-left"
          >
            <ListPlus className="w-4 h-4 shrink-0" />
            Add to Playlist
          </button>
          <div className="h-px bg-white/5 mx-3" />
          <button
            onClick={handlePlayNext}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white hover:bg-white/10 transition-colors text-left"
          >
            <PlayCircle className="w-4 h-4 shrink-0" />
            Play Next
          </button>
          <button
            onClick={handleAddToQueue}
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white hover:bg-white/10 transition-colors text-left"
          >
            <ListMusic className="w-4 h-4 shrink-0" />
            Add to Queue
          </button>
        </div>
      )}

      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        song={song}
      />
    </div>
  );
}
