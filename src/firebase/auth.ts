import { createContext } from 'react';
import { auth } from './index';
import {
  GithubAuthProvider,
  onAuthStateChanged,
  Unsubscribe,
  User,
  signInWithPopup,
  UserCredential,
  GoogleAuthProvider,
} from 'firebase/auth';

/**
 * Global auth context for the application.
 */
export const AuthContext = createContext<User | null>(null);

/**
 * Gets a user instance once and unsubscribes from future changes.
 */
export function getUserOnce(): Promise<User | null> {
  return new Promise((resolve) => {
    let unsubscribe: Unsubscribe;
    unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      return resolve(user);
    });
  });
}

export function signInWithGitHub(): Promise<UserCredential> {
  const provider = new GithubAuthProvider();
  // Add additional provider scope/data as required.
  return signInWithPopup(auth, provider);
}

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // Add additional provider scope/data as required.
  return signInWithPopup(auth, provider);
}
