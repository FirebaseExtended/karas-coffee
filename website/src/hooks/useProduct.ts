import { useFirestoreDocumentData } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import { UseQueryResult } from 'react-query';
import { collections } from '../firebase';
import { Product } from '../types';

export function useProduct(id: string): UseQueryResult<Product> {
  const collection = collections.products;
  const ref = doc(collection, id);

  return useFirestoreDocumentData<Product>(['product', id], ref, {
    subscribe: true,
  });
}
