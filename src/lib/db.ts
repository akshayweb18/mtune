import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Song, CustomPlaylist } from '@/types';

export interface UserLibraryData {
  likedSongs: Song[];
  recentSongs: Song[];
  customPlaylists: CustomPlaylist[];
}

const DEFAULT_LIBRARY: UserLibraryData = {
  likedSongs: [],
  recentSongs: [],
  customPlaylists: [],
};

export async function getUserLibrary(uid: string): Promise<UserLibraryData> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserLibraryData;
    } else {
      // If no data exists, initialize with default
      await setDoc(docRef, DEFAULT_LIBRARY);
      return DEFAULT_LIBRARY;
    }
  } catch (error) {
    console.error('Error fetching user library:', error);
    return DEFAULT_LIBRARY; // Fallback to empty on error
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
