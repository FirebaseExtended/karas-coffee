import { orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { collections } from '../firebase';
import { useFirestoreQuery } from './useFirestore';
import { useUser } from './useUser';

export function useOrders() {
  const user = useUser();

  if (!user.data) {
    throw new Error('Orders can only be fetched for authenticated users.');
  }

  const collection = collections.payments(user.data.uid);
  const constraints: QueryConstraint[] = [];

  constraints.push(where('metadata.mode', '==', 'payment'));
  constraints.push(orderBy('created'));

  return useFirestoreQuery('orders', query(collection, ...constraints));
}
