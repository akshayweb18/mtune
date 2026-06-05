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

  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  setExpanded: (expanded: boolean) => set({ isExpanded: expanded }),
  
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
    return { currentSong: state.queue[currentIndex + 1], isPlaying: true };
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
