import { auth } from './index';
import { onAuthStateChanged, User } from 'firebase/auth';
/**
 * Gets a user instance once and unsubscribes from future changes.
 */
export function getUserOnce(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      return resolve(user);
    });
  });
}
