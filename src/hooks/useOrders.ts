import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { collections } from '../firebase';
import { useUser } from './useUser';

export function useOrders() {
  const user = useUser();

  if (!user.data) {
    throw new Error('Orders can only be fetched for authenticated users.');
  }

  const collection = collections.payments(user.data.uid);
  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('created', 'desc'));

  return useFirestoreQueryData('orders', query(collection, ...constraints));
}
