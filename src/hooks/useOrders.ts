import { orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { collections } from '../firebase';
import { useUser } from './useUser';

export function useOrders() {
  const user = useUser();

  if (!user) {
    throw new Error('Orders can only be fetched for authenticated users.');
  }

  const collection = collections.payments(user.uid);
  const constraints: QueryConstraint[] = [];

  constraints.push(where('metadata.mode', '==', 'payment'));
  constraints.push(orderBy('created'));

  return useFirestoreCollectionData(query(collection, ...constraints));
}
