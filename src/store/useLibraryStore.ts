import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song } from '@/types';

interface LibraryState {
  likedSongs: Song[];
  recentSongs: Song[];
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  addToHistory: (song: Song) => void;
  clearHistory: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      likedSongs: [],
      recentSongs: [],
      toggleLike: (song) => {
        const { likedSongs } = get();
        const exists = likedSongs.some((s) => s.id === song.id);
        if (exists) {
          set({ likedSongs: likedSongs.filter((s) => s.id !== song.id) });
        } else {
          set({ likedSongs: [song, ...likedSongs] });
        }
      },
      isLiked: (songId) => get().likedSongs.some((s) => s.id === songId),
      addToHistory: (song) => {
        const { recentSongs } = get();
        const filtered = recentSongs.filter((s) => s.id !== song.id);
        set({ recentSongs: [song, ...filtered].slice(0, 50) }); // Keep last 50 songs
      },
      clearHistory: () => set({ recentSongs: [] }),
    }),
    {
      name: 'music-library-storage', // key in localStorage
    }
  )
);
