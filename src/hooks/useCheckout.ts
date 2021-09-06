import { useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';

import { collections } from '../firebase';
import { Checkout_Sessions } from '../types';
// import Stripe from '../../scripts/stripe';

export function useCheckout(id: string | undefined, sessionID: string, checkout_sessions: Checkout_Sessions) {
  const checkoutSessionCollection = collections.checkoutSessions;

  const ref = doc(checkoutSessionCollection, `/${id}/checkout_sessions/${sessionID}`);

  return useCallback(async () => {
    return setDoc(ref, { ...checkout_sessions }, { merge: true });
  }, [id]);
}
