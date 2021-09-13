import { useFirestoreDocumentData, useFirestoreQueryData } from '@react-query-firebase/firestore';
import { doc, FieldPath, orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { collections } from '../firebase';

export const TOXICITY_THRESHOLD = 0.6;

export function useProductReviews(productId: string) {
  const collection = collections.productReviews(productId);

  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('attribute_scores.TOXICITY'));
  constraints.push(orderBy('created_at', 'desc'));

  // Ensure the record has all the toxicity fields.
  constraints.push(where(new FieldPath('attribute_scores', 'TOXICITY'), '<', TOXICITY_THRESHOLD));

  return useFirestoreQueryData(['reviews', productId], query(collection, ...constraints), {
    subscribe: true,
  });
}

export function useProductReview(productId: string, reviewId: string) {
  const collection = collections.productReviews(productId);

  return useFirestoreDocumentData(['reviews', productId, reviewId], doc(collection, reviewId), {
    subscribe: true,
  });
}
