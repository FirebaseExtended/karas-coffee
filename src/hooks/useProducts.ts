import { orderBy, OrderByDirection, query } from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { collections } from '../firebase';

export function useProducts(order: string, direction?: OrderByDirection) {
  const collection = collections.products;
  const products = query(collection, orderBy(order, direction));

  return useFirestoreCollectionData(products);
}
