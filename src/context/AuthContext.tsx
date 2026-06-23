'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, setAuthCookie, clearAuthCookie } from '@/lib/auth';
import { getUserLibrary, saveUserLibrary } from '@/lib/db';
import { useLibraryStore } from '@/store/useLibraryStore';
import { usePlayerStore } from '@/store/usePlayerStore';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setAuthCookie(firebaseUser.uid);
        setUser(firebaseUser);

        // 1. Instantly restore from per-user localStorage for snappy UI
        try {
          const localData = localStorage.getItem(`mtune_lib_${firebaseUser.uid}`);
          if (localData) {
            const parsed = JSON.parse(localData);
            useLibraryStore.getState().setLibraryData(parsed);
            // Restore queue to player
            if (parsed.queue?.length) {
              usePlayerStore.getState().setQueue(parsed.queue);
            }
          }
        } catch (e) {
          console.error('Failed to parse local library data:', e);
        }
        initialLoadDone.current = true;

        // 2. Fetch latest from Firestore in the background (source of truth)
        const libraryData = await getUserLibrary(firebaseUser.uid);
        useLibraryStore.getState().setLibraryData(libraryData);
        // Restore queue from Firestore
        if (libraryData.queue?.length) {
          usePlayerStore.getState().setQueue(libraryData.queue);
        }
        // Update local cache with cloud data
        localStorage.setItem(`mtune_lib_${firebaseUser.uid}`, JSON.stringify(libraryData));

      } else {
        clearAuthCookie();
        setUser(null);

        // Wipe ALL user-specific data on logout
        useLibraryStore.getState().clearLibrary();
        usePlayerStore.getState().resetPlayer();
        initialLoadDone.current = false;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Debounced sync — writes to localStorage immediately and Firestore after 1.5s idle
  useEffect(() => {
    const unsubscribeStore = useLibraryStore.subscribe((state) => {
      if (!user || !initialLoadDone.current) return;

      const dataToSave = {
        likedSongs: state.likedSongs,
        recentSongs: state.recentSongs,
        customPlaylists: state.customPlaylists,
        searchHistory: state.searchHistory,
        followedArtists: state.followedArtists,
        downloadedSongs: state.downloadedSongs,
        settings: state.settings,
        queue: usePlayerStore.getState().queue,
      };

      // Immediate local save per-user key
      localStorage.setItem(`mtune_lib_${user.uid}`, JSON.stringify(dataToSave));

      // Debounce Firestore writes to avoid hitting quota on rapid changes
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveUserLibrary(user.uid, dataToSave);
      }, 1500);
    });

    return () => {
      unsubscribeStore();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [user]);

  // Also sync queue changes from player store
  useEffect(() => {
    const unsubscribePlayer = usePlayerStore.subscribe((state) => {
      if (!user || !initialLoadDone.current) return;

      const queueToSave = state.queue;
      const localRaw = localStorage.getItem(`mtune_lib_${user.uid}`);
      try {
        const local = localRaw ? JSON.parse(localRaw) : {};
        local.queue = queueToSave;
        localStorage.setItem(`mtune_lib_${user.uid}`, JSON.stringify(local));
      } catch {}

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveUserLibrary(user.uid, { queue: queueToSave });
      }, 1500);
    });

    return () => unsubscribePlayer();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
