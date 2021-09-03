import { FieldPath, orderBy, OrderByDirection, query, QueryConstraint, limit, where, WhereFilterOp } from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { collections } from '../firebase';

export type UseProductsConstraints = {
  limitTo?: number;
  // Order: [field, direction]
  orders: [FieldPath | string, OrderByDirection | void][];
  // Where: [field, op, value]
  filters: [FieldPath | string, WhereFilterOp, any][];
};

export function useProducts({ limitTo, orders, filters }: UseProductsConstraints) {
  const collection = collections.products;
  const constraints: QueryConstraint[] = [];

  if (limitTo) {
    constraints.push(limit(limitTo))
  }

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
