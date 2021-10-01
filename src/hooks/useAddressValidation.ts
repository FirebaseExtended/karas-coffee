import { useCallback, useState } from 'react';
import { deleteDoc, doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import { useNavigate } from 'react-router';

import { collections } from '../firebase';
import { useUser } from './useUser';
import { AddressFormValues } from '../components/Address';

export function useAddressValidation() {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUser();

  const uid = user.data?.uid;

  const validate = useCallback(
    async (address: AddressFormValues) => {
      if (!uid) {
        return navigate(`/signin?redirect=${window.location.pathname}`);
      }

      setLoading(true);
      const collection = collections.addresses;
      const ref = doc(collection, uid);

      return new Promise<void>(async (resolve, reject) => {
        try {
          await setDoc(ref, {
            address: {
              name: address.name,
              addressLine1: address.line1,
              addressLine2: address.line2,
              cityLocality: address.city,
              postalCode: address.postal_code,
              stateProvince: address.state,
              countryCode: 'US',
            },
          });

          // Declare the unsubscribe function.
          let unsubscribe: Unsubscribe;

          // Listen to changes to the new ref.
          unsubscribe = onSnapshot(
            ref,
            (snapshot) => {
              const data = snapshot.data();
              const validation = data?.validation;

              if (validation?.status) {
                unsubscribe?.();
                setLoading(false);

                // https://www.shipengine.com/docs/addresses/validation/#address-status-meanings
                if (validation.status === 'verified' || validation.status === 'warning') {
                  return resolve();
                } else {
                  const error = new Error('The address could not be verified.');
                  setError(error);
                  return reject(error);
                }
              }
            },
            (e) => {
              console.log(e);
              unsubscribe?.();
              setError(e);
              setLoading(false);
              return reject(e);
            },
          );
        } catch (e: any) {
          setError(e);
          setLoading(false);
        }
      });
    },
    [uid],
  );

  return { validate, loading, error };
}
