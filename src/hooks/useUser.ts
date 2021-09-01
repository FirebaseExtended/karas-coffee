import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../firebase';
import { AuthContext } from '../firebase/auth';

/**
 * Returns the current user from context.
 * @returns User | null
 */
export function useUser(): User | null {
  return useContext(AuthContext);
}

/**
 * Subscribes to the user's authentication state.
 *
 * @param initialUser The initial state of the user.
 * @returns User | null
 */
export function useUserState(initialUser: User | null): User | null {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return user;
}
