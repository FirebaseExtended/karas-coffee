import { useFirestoreDocumentData } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import { collections } from '../firebase';
import { useUser } from './useUser';

export function useAddress() {
  const user = useUser();

  if (!user.data) {
    throw new Error('Addresses can only be fetched for authenticated users.');
  }

  const collection = collections.addresses;

  return useFirestoreDocumentData('address', doc(collection, user.data.uid));
}
