import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../firebase';

/**
 * Subscribes to the user's authentication state.
 *
 * @param initialUser The initial state of the user.
 * @returns User | null
 */
export function useUser(initialUser: User | null): User | null {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return user;
}
