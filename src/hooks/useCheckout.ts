import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';

import { collections } from '../firebase';
import { useUser } from './useUser';
import { Session } from '../types';

export function useCheckout() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUser();

  if (!user.data) {
    throw new Error('User must be authenticated to use the checkout.');
  }

  const uid = user.data.uid;

  const checkout = useCallback(async (session: Omit<Session, 'url' | 'customer'>) => {
    setLoading(true);
    const collection = collections.sessions(uid);
    const ref = doc(collection);

    try {
      const customer = await getDoc(doc(collections.customers, uid));
      const { stripe_id } = customer.data() ?? {};

      if (!stripe_id) {
        throw new Error('Customer does not exist in the database.');
      }

      // Declare the unsubscribe function.
      let unsubscribe: Unsubscribe;

      // Listen to changes to the new ref.
      unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          const data = snapshot.data();

          if (data?.url) {
            unsubscribe?.();
            window.location.assign(data.url);
          }

          if (data?.error) {
            unsubscribe?.();
            setError(new Error(data.error.message));
            setLoading(false);
          }
        },
        (e) => {
          unsubscribe?.();
          setError(e);
          setLoading(false);
        },
      );

      await setDoc(ref, {
        ...session,
        customer: stripe_id,
      });
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }, [uid]);

  return { checkout, loading, error };
}
