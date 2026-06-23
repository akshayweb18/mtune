import { create } from 'zustand';
import { Song, CustomPlaylist, Artist } from '@/types';
import { UserSettings } from '@/lib/db';

interface LibraryState {
  // Existing
  likedSongs: Song[];
  recentSongs: Song[];
  customPlaylists: CustomPlaylist[];

  // New
  searchHistory: string[];
  followedArtists: Artist[];
  downloadedSongs: Song[];
  settings: UserSettings;

  // Actions — Liked Songs
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;

  // Actions — History
  addToHistory: (song: Song) => void;
  clearHistory: () => void;

  // Actions — Playlists
  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;

  // Actions — Search History
  addSearchHistory: (query: string) => void;
  removeSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // Actions — Followed Artists
  toggleFollowArtist: (artist: Artist) => void;
  isFollowing: (artistId: string) => boolean;

  // Actions — Downloads
  toggleDownload: (song: Song) => void;
  isDownloaded: (songId: string) => boolean;

  // Actions — Settings
  updateSettings: (updates: Partial<UserSettings>) => void;

  // Actions — Sync
  setLibraryData: (data: Partial<LibraryState>) => void;
  clearLibrary: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  streamingQuality: 'high',
  autoplay: true,
  notifications: true,
  language: 'all',
};

export const useLibraryStore = create<LibraryState>((set, get) => ({
  likedSongs: [],
  recentSongs: [],
  customPlaylists: [],
  searchHistory: [],
  followedArtists: [],
  downloadedSongs: [],
  settings: DEFAULT_SETTINGS,

  // --- Liked Songs ---
  toggleLike: (song) => {
    const { likedSongs } = get();
    const exists = likedSongs.some((s) => s.id === song.id);
    set({ likedSongs: exists ? likedSongs.filter((s) => s.id !== song.id) : [song, ...likedSongs] });
  },
  isLiked: (songId) => get().likedSongs.some((s) => s.id === songId),

  // --- History ---
  addToHistory: (song) => {
    const { recentSongs } = get();
    const filtered = recentSongs.filter((s) => s.id !== song.id);
    set({ recentSongs: [song, ...filtered].slice(0, 50) });
  },
  clearHistory: () => set({ recentSongs: [] }),

  // --- Playlists ---
  createPlaylist: (name) => {
    const newPlaylist: CustomPlaylist = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      createdAt: Date.now(),
      songs: [],
    };
    set((state) => ({ customPlaylists: [...state.customPlaylists, newPlaylist] }));
    return newPlaylist.id;
  },
  deletePlaylist: (id) => {
    set((state) => ({ customPlaylists: state.customPlaylists.filter((p) => p.id !== id) }));
  },
  addSongToPlaylist: (playlistId, song) => {
    set((state) => ({
      customPlaylists: state.customPlaylists.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        if (playlist.songs.some((s) => s.id === song.id)) return playlist;
        return { ...playlist, songs: [...playlist.songs, song] };
      }),
    }));
  },
  removeSongFromPlaylist: (playlistId, songId) => {
    set((state) => ({
      customPlaylists: state.customPlaylists.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        return { ...playlist, songs: playlist.songs.filter((s) => s.id !== songId) };
      }),
    }));
  },

  // --- Search History ---
  addSearchHistory: (query) => {
    if (!query.trim()) return;
    const { searchHistory } = get();
    const filtered = searchHistory.filter((q) => q !== query);
    set({ searchHistory: [query, ...filtered].slice(0, 20) });
  },
  removeSearchHistory: (query) => {
    set((state) => ({ searchHistory: state.searchHistory.filter((q) => q !== query) }));
  },
  clearSearchHistory: () => set({ searchHistory: [] }),

  // --- Followed Artists ---
  toggleFollowArtist: (artist) => {
    const { followedArtists } = get();
    const exists = followedArtists.some((a) => a.id === artist.id);
    set({ followedArtists: exists ? followedArtists.filter((a) => a.id !== artist.id) : [artist, ...followedArtists] });
  },
  isFollowing: (artistId) => get().followedArtists.some((a) => a.id === artistId),

  // --- Downloads ---
  toggleDownload: (song) => {
    const { downloadedSongs } = get();
    const exists = downloadedSongs.some((s) => s.id === song.id);
    set({ downloadedSongs: exists ? downloadedSongs.filter((s) => s.id !== song.id) : [song, ...downloadedSongs] });
  },
  isDownloaded: (songId) => get().downloadedSongs.some((s) => s.id === songId),

  // --- Settings ---
  updateSettings: (updates) => {
    set((state) => ({ settings: { ...state.settings, ...updates } }));
  },

  // --- Sync ---
  setLibraryData: (data) => set((state) => ({ ...state, ...data })),
  clearLibrary: () =>
    set({
      likedSongs: [],
      recentSongs: [],
      customPlaylists: [],
      searchHistory: [],
      followedArtists: [],
      downloadedSongs: [],
      settings: DEFAULT_SETTINGS,
    }),
}));
