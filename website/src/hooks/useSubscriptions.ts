import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { DocumentData, orderBy, query, QueryConstraint } from 'firebase/firestore';
import { UseQueryResult } from 'react-query';
import { collections } from '../firebase';
import { useUser } from './useUser';

export function useSubscriptions(): UseQueryResult<DocumentData[]> {
  const user = useUser();

  if (!user.data) {
    throw new Error('Subscriptions can only be fetched for authenticated users.');
  }
  const collection = collections.subscriptions(user.data.uid);
  const constraints: QueryConstraint[] = [];

  // TODO(ehesp): Is this needed?
  // constraints.push(where('metadata.mode', '==', 'subscription'));
  constraints.push(orderBy('created', 'desc'));

  return useFirestoreQueryData('subscriptions', query(collection, ...constraints));
}

export function useInvoices(subscriptionId: string): UseQueryResult<DocumentData[]> {
  const user = useUser();

  if (!user.data) {
    throw new Error('Subscription Invoices can only be fetched for authenticated users.');
  }

  const collection = collections.invoices(user.data.uid, subscriptionId);
  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('created'));

  return useFirestoreQueryData(['invoices', subscriptionId], query(collection, ...constraints));
}
