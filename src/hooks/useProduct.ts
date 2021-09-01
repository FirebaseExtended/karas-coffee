import { doc, orderBy, OrderByDirection, query } from 'firebase/firestore';
import { useFirestoreDocDataOnce } from 'reactfire';
import { collections, firestore } from '../firebase';

export function useProduct(id: string) {
  const collection = collections.products;
  const ref = doc(collection, id);

  return useFirestoreDocDataOnce(ref);
}
