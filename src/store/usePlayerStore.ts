import { create } from 'zustand';
import { Song } from '@/types';

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  isExpanded: boolean;

  // Auth popup state
  songsPlayedCount: number;
  showAuthPopup: boolean;
  popupDismissed: boolean;
  isAuthenticated: boolean;

  // Actions
  setCurrentSong: (song: Song) => void;
  setQueue: (queue: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setExpanded: (expanded: boolean) => void;
  dismissAuthPopup: () => void;
  setAuthenticated: (value: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  isMuted: false,
  isLooping: false,
  isShuffling: false,
  isExpanded: false,

  songsPlayedCount: 0,
  showAuthPopup: false,
  popupDismissed: false,
  isAuthenticated: false,

  setCurrentSong: (song) => set((state) => {
    // If already authenticated, always allow
    if (state.isAuthenticated) {
      return { currentSong: song, isPlaying: true };
    }

    const newCount = state.songsPlayedCount + 1;

    // Block the 4th+ song and show popup
    if (newCount > 3) {
      return {
        showAuthPopup: true,
        isPlaying: false,
      };
    }

    return {
      currentSong: song,
      isPlaying: true,
      songsPlayedCount: newCount,
    };
  }),

  setExpanded: (expanded: boolean) => set({ isExpanded: expanded }),

  dismissAuthPopup: () => set({ showAuthPopup: false }),

  setAuthenticated: (value: boolean) => set({
    isAuthenticated: value,
    showAuthPopup: false,
    popupDismissed: true,
  }),

  setQueue: (queue) => set({ queue }),

  addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),

  removeFromQueue: (songId) => set((state) => ({
    queue: state.queue.filter(s => s.id !== songId)
  })),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  next: () => set((state) => {
    if (state.queue.length === 0 || !state.currentSong) return state;
    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong?.id);
    if (currentIndex === -1 || currentIndex === state.queue.length - 1) {
      if (state.isLooping) {
        return { currentSong: state.queue[0], isPlaying: true };
      }
      return { isPlaying: false, progress: 0 };
    }

    // Check auth limit for next song
    if (!state.isAuthenticated && state.songsPlayedCount >= 3) {
      return { showAuthPopup: true, isPlaying: false };
    }

    return {
      currentSong: state.queue[currentIndex + 1],
      isPlaying: true,
      songsPlayedCount: state.songsPlayedCount + 1,
    };
  }),

  previous: () => set((state) => {
    if (state.queue.length === 0 || !state.currentSong) return state;
    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong?.id);
    if (currentIndex <= 0) {
      if (state.isLooping) {
        return { currentSong: state.queue[state.queue.length - 1], isPlaying: true };
      }
      return { progress: 0 };
    }
    return { currentSong: state.queue[currentIndex - 1], isPlaying: true };
  }),

  setVolume: (volume) => set({ volume }),

  setProgress: (progress) => set({ progress }),

  setDuration: (duration) => set({ duration }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),

  toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
}));
