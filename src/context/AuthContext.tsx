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
        
        // Fetch user's library from Firestore
        const libraryData = await getUserLibrary(firebaseUser.uid);
        useLibraryStore.getState().setLibraryData(libraryData);
        initialLoadDone.current = true;
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

  // Sync store changes to Firestore
  useEffect(() => {
    const unsubscribeStore = useLibraryStore.subscribe((state) => {
      if (user && initialLoadDone.current) {
        saveUserLibrary(user.uid, {
          likedSongs: state.likedSongs,
          recentSongs: state.recentSongs,
          customPlaylists: state.customPlaylists,
        });
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
