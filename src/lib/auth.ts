import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type NextOrObserver,
} from 'firebase/auth';
import { auth } from './firebase';

// ─── Google Provider ───────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ─── Cookie helpers (for middleware route protection) ──────────────────────────
const AUTH_COOKIE = 'mtune-auth';

export function setAuthCookie(uid: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `${AUTH_COOKIE}=${uid}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── Auth operations ──────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  setAuthCookie(result.user.uid);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  setAuthCookie(result.user.uid);
  return result.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  setAuthCookie(result.user.uid);
  return result.user;
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  clearAuthCookie();
  await signOut(auth);
}

export function onAuthChange(callback: NextOrObserver<User>) {
  return onAuthStateChanged(auth, callback);
}
