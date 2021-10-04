import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { DocumentData, orderBy, query, QueryConstraint } from 'firebase/firestore';
import { UseQueryResult } from 'react-query';
import { collections } from '../firebase';
import { useUser } from './useUser';

export function useOrders(): UseQueryResult<DocumentData> {
  const user = useUser();

  if (!user.data) {
    throw new Error('Orders can only be fetched for authenticated users.');
  }

  const collection = collections.payments(user.data.uid);
  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('created', 'desc'));

  return useFirestoreQueryData('orders', query(collection, ...constraints));
}
