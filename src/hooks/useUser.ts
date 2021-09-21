import { useAuthUser } from '@react-query-firebase/auth';

import { auth } from '../firebase';

/**
 * Subscribes to the current user.
 */
export function useUser() {
  return useAuthUser('user', auth);
}
