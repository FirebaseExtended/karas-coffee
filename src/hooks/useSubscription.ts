import { collections } from '../firebase';
import { useUser } from './useUser';
import { QueryConstraint, query, where, FieldPath, documentId } from 'firebase/firestore';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';

export function useSubscription(id: string) {
  const user = useUser();

  if (!user.data) {
    throw new Error('Subscriptions can only be fetched for authenticated users.');
  }

  const collection = collections.subscriptions(user.data.uid);

  const constraints: QueryConstraint[] = [];

  constraints.push(where(documentId(), '==', id));
  constraints.push(where('status', '==', 'active'));

  return useFirestoreQueryData(id, query(collection, ...constraints), {
    subscribe: false,
  });
}
