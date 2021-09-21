import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { collections } from '../firebase';
import { useUser } from './useUser';

export function useSubscriptions() {
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

export function useInvoices(subscriptionId: string) {
  const user = useUser();

  if (!user.data) {
    throw new Error('Subscription Invoices can only be fetched for authenticated users.');
  }

  const collection = collections.invoices(user.data.uid, subscriptionId);
  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('created'));

  return useFirestoreQueryData(['invoices', subscriptionId], query(collection, ...constraints));
}
