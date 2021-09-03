import { doc, orderBy, query, QueryConstraint } from 'firebase/firestore';
import { useFirestoreCollectionData, useFirestoreDoc } from 'reactfire';
import { collections } from '../firebase';

export function useReviews(productId: string) {
  const collection = collections.productReviews(productId);

  const constraints: QueryConstraint[] = [];
  constraints.push(orderBy('created_at', 'desc'));

  return useFirestoreCollectionData(query(collection, ...constraints));
}

export function useReview(productId: string, reviewId: string) {
  const collection = collections.productReviews(productId);

  return useFirestoreDoc(doc(collection, reviewId));
}
