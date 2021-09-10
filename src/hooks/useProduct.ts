import { doc } from 'firebase/firestore';
import { collections } from '../firebase';
import { useFirestoreDocument } from './useFirestore';

export function useProduct(id: string) {
  const collection = collections.products;
  const ref = doc(collection, id);

  return useFirestoreDocument(`product-${id}`, ref);
}
