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

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setAuthCookie(firebaseUser.uid);
        setUser(firebaseUser);
        
        // 1. Instantly load from localStorage for snappy UI
        const localData = localStorage.getItem(`mtune_lib_${firebaseUser.uid}`);
        if (localData) {
          try {
            useLibraryStore.getState().setLibraryData(JSON.parse(localData));
          } catch (e) {
            console.error('Failed to parse local library data', e);
          }
        }
        initialLoadDone.current = true;

        // 2. Fetch user's library from Firestore in background
        const libraryData = await getUserLibrary(firebaseUser.uid);
        useLibraryStore.getState().setLibraryData(libraryData);
        // Save merged/latest data back to local storage
        localStorage.setItem(`mtune_lib_${firebaseUser.uid}`, JSON.stringify(libraryData));
      } else {
        clearAuthCookie();
        setUser(null);
        
        // Clear library for guests (or when logged out)
        useLibraryStore.getState().clearLibrary();
        initialLoadDone.current = false;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync store changes to Firestore AND localStorage
  useEffect(() => {
    const unsubscribeStore = useLibraryStore.subscribe((state) => {
      if (user && initialLoadDone.current) {
        const dataToSave = {
          likedSongs: state.likedSongs,
          recentSongs: state.recentSongs,
          customPlaylists: state.customPlaylists,
        };

        // Save to local storage immediately per-user
        localStorage.setItem(`mtune_lib_${user.uid}`, JSON.stringify(dataToSave));

        // Save to Firestore asynchronously
        saveUserLibrary(user.uid, dataToSave);
      }
    });

    return () => unsubscribeStore();
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
