import { CollectionReference, doc, FieldPath, orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { useFirestoreCollectionData, useFirestoreDoc } from 'reactfire';
import { collections } from '../firebase';
import { Review } from '../types';

export const TOXICITY_THRESHOLD = 0.60;

function useReviews<T>(collection: CollectionReference<T>) {
  const constraints: QueryConstraint[] = [];


  constraints.push(orderBy('attribute_scores.TOXICITY'));
  constraints.push(orderBy('created_at', 'desc'));

  // Ensure the record has all the toxicity fields.
  // constraints.push(where(new FieldPath('attribute_scores', 'TOXICITY'), '!=', null));
  constraints.push(where(new FieldPath('attribute_scores', 'TOXICITY'), '<', TOXICITY_THRESHOLD));

  return useFirestoreCollectionData(query(collection, ...constraints));
}

export function useProductReviews(productId: string) {
  const collection = collections.productReviews(productId);
  return useReviews<Review>(collection);
}

export function useProductReview(productId: string, reviewId: string) {
  const collection = collections.productReviews(productId);
  return useFirestoreDoc(doc(collection, reviewId));
}
