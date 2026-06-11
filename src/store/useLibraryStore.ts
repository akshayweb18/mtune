import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song, CustomPlaylist } from '@/types';

interface LibraryState {
  likedSongs: Song[];
  recentSongs: Song[];
  customPlaylists: CustomPlaylist[];
  
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  
  addToHistory: (song: Song) => void;
  clearHistory: () => void;
  
  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
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
      
      customPlaylists: [],
      
      createPlaylist: (name) => {
        const newPlaylist: CustomPlaylist = {
          id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          name,
          createdAt: Date.now(),
          songs: []
        };
        set((state) => ({ customPlaylists: [...state.customPlaylists, newPlaylist] }));
        return newPlaylist.id;
      },
      
      deletePlaylist: (id) => {
        set((state) => ({
          customPlaylists: state.customPlaylists.filter(p => p.id !== id)
        }));
      },
      
      addSongToPlaylist: (playlistId, song) => {
        set((state) => ({
          customPlaylists: state.customPlaylists.map(playlist => {
            if (playlist.id === playlistId) {
              // Check if song already exists
              if (playlist.songs.some(s => s.id === song.id)) return playlist;
              return { ...playlist, songs: [...playlist.songs, song] };
            }
            return playlist;
          })
        }));
      },
      
      removeSongFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          customPlaylists: state.customPlaylists.map(playlist => {
            if (playlist.id === playlistId) {
              return { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) };
            }
            return playlist;
          })
        }));
      },
    }),
    {
      name: 'music-library-storage', // key in localStorage
    }
  )
);
