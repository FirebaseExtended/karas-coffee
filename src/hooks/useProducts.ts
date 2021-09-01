import { orderBy, OrderByDirection, query, QueryConstraint, where, WhereFilterOp } from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { collections } from '../firebase';

export type UseProductsConstraints = {
  // Order: [field, direction]
  orders: [string, OrderByDirection | void][];
  // Where: [field, op, value]
  filters: [string, WhereFilterOp, any][];
};

export function useProducts({ orders, filters }: UseProductsConstraints) {
  const collection = collections.products;
  const constraints: QueryConstraint[] = [];

  if (orders) {
    for (const [field, direction] of orders) {
      constraints.push(orderBy(field, direction || undefined));
    }
  }

  if (filters) {
    for (const [field, op, value] of filters) {
      constraints.push(where(field, op, value));
    }
  }

  return useFirestoreCollectionData(query(collection, ...constraints));
}
