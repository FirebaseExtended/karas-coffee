import { collections } from '../firebase';
import { useUser } from './useUser';
import { QueryConstraint, query, where, limit } from 'firebase/firestore';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { Subscription } from '../types';
import { UseQueryResult } from 'react-query';

export function useSubscription(): UseQueryResult<Subscription | null> {
  const user = useUser();

  if (!user.data) {
    throw new Error('Subscriptions can only be fetched for authenticated users.');
  }

  const collection = collections.subscriptions(user.data.uid);

  const constraints: QueryConstraint[] = [];

  constraints.push(where('status', '==', 'active'));
  constraints.push(limit(1));

  return useFirestoreQueryData<Subscription, Subscription | null>(
    'subscription',
    query(collection, ...constraints),
    undefined,
    {
      select(subscriptions) {
        if (subscriptions.length === 0) {
          return null;
        }

        return subscriptions[0];
      },
    },
  );
}
