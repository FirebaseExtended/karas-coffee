import { useFirestoreDocumentData } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import { collections } from '../firebase';

export function useProduct(id: string) {
  const collection = collections.products;
  const ref = doc(collection, id);

  return useFirestoreDocumentData(['product', id], ref, {
    subscribe: true,
  });
}
