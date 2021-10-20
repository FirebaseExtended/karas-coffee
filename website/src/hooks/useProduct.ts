import { useFirestoreDocumentData } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import { collections } from '../firebase';
import { Product } from '../types';

export function useProduct(id: string) {
  const collection = collections.products;
  const ref = doc(collection, id);

  return useFirestoreDocumentData<Product>(['product', id], ref, {
    subscribe: true,
  });
}
