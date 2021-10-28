/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useState } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';

import { collections } from '../firebase';
import { useUser } from './useUser';
import { Session } from '../types';

export function useCheckout(): {
  trigger: (session: Omit<Session, 'url' | 'customer'>) => void;
  loading: boolean;
  error: Error | null;
} {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUser();

  const uid = user.data?.uid;

  const trigger = useCallback(
    async (session: Omit<Session, 'url' | 'customer'>) => {
      if (!uid) {
        return navigate(`/signin?redirect=${window.location.pathname}`);
      }

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

        // Listen to changes to the new ref.
        const unsubscribe = onSnapshot(
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    },
    [uid],
  );

  return { trigger, loading, error };
}
