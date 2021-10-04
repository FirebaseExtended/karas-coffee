import { namedQuery, useFirestoreQueryData, NamedQuery } from '@react-query-firebase/firestore';
import { query, QueryConstraint, Query } from 'firebase/firestore';
import { QueryKey } from 'react-query';
import { collections, firestore } from '../firebase';
import { Product } from '../types';

function isQueryConstraints(value: unknown): value is QueryConstraint[] {
  return Array.isArray(value);
}

export function useProducts(key: QueryKey, constraintsOrNamedQuery?: QueryConstraint[] | string) {
  const collection = collections.products;
  let ref: Query<Product> | NamedQuery<Product>;

  if (constraintsOrNamedQuery) {
    if (isQueryConstraints(constraintsOrNamedQuery)) {
      ref = query(collection, ...constraintsOrNamedQuery);
    } else {
      ref = namedQuery(firestore, constraintsOrNamedQuery);
    }
  } else {
    ref = query(collection);
  }

  return useFirestoreQueryData(key, ref, {
    subscribe: true,
  });
}
