import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentDeletion,
  useFirestoreQueryData,
} from '@react-query-firebase/firestore';
import { doc, query } from 'firebase/firestore';
import { collections } from '../firebase';
import { Address } from '../types';
import { useUser } from './useUser';

/**
 * Returns a list of the users addresses.
 */
export function useAddresses() {
  const user = useUser();

  if (!user.data) {
    throw new Error('Addresses can only be fetched for authenticated users.');
  }

  const collection = collections.addresses(user.data.uid);

  return useFirestoreQueryData('addresses', query(collection), {
    subscribe: true,
  });
}

/**
 * Adds a new address to the user's address collection.
 */
export function useAddAddress() {
  const user = useUser();

  if (!user.data) {
    throw new Error('Addresses can only be fetched for authenticated users.');
  }

  const collection = collections.addresses(user.data.uid);

  return useFirestoreCollectionMutation<Omit<Address, 'id'>>(collection);
}

/**
 * Deletes a document from the address collection.
 */
export function useDeleteAddress(id: string) {
  const user = useUser();

  if (!user.data) {
    throw new Error('Addresses can only be fetched for authenticated users.');
  }

  const collection = collections.addresses(user.data.uid);

  return useFirestoreDocumentDeletion(doc(collection, id));
}
