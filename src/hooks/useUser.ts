import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../firebase';
import { getUserOnce } from '../firebase/auth';
import { useQuery, useQueryClient } from 'react-query';

/**
 * Subscribes to the current user.
 */
export function useUser() {
  const client = useQueryClient();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const exists = client.getQueryData('user');

      if (exists && !user) {
        client.setQueryData<User | null>('user', null);
      } else if (!exists && !!user) {
        client.setQueryData<User | null>('user', user);
      }
    });
  }, []);

  return useQuery<User | null>('user', getUserOnce);
}
