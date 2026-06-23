import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Song, CustomPlaylist, Artist } from '@/types';

export interface UserSettings {
  streamingQuality: 'low' | 'medium' | 'high';
  autoplay: boolean;
  notifications: boolean;
  language: string;
}

export interface UserLibraryData {
  // Library
  likedSongs: Song[];
  recentSongs: Song[];
  customPlaylists: CustomPlaylist[];
  // Search
  searchHistory: string[];
  // Queue
  queue: Song[];
  // Artists
  followedArtists: Artist[];
  // Downloads (track IDs saved offline)
  downloadedSongs: Song[];
  // Settings
  settings: UserSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  streamingQuality: 'high',
  autoplay: true,
  notifications: true,
  language: 'all',
};

const DEFAULT_LIBRARY: UserLibraryData = {
  likedSongs: [],
  recentSongs: [],
  customPlaylists: [],
  searchHistory: [],
  queue: [],
  followedArtists: [],
  downloadedSongs: [],
  settings: DEFAULT_SETTINGS,
};

export async function getUserLibrary(uid: string): Promise<UserLibraryData> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Merge with defaults so new fields are always present
      return { ...DEFAULT_LIBRARY, ...docSnap.data() } as UserLibraryData;
    } else {
      // Initialize new user with defaults
      await setDoc(docRef, DEFAULT_LIBRARY);
      return DEFAULT_LIBRARY;
    }
  } catch (error) {
    console.error('Error fetching user library:', error);
    return DEFAULT_LIBRARY;
  }
}

export async function saveUserLibrary(uid: string, data: Partial<UserLibraryData>) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving user library:', error);
  }
}
