import { doc, query } from 'firebase/firestore';
import { useFirestoreCollectionData, useFirestoreDoc } from 'reactfire';
import { collections } from '../firebase';

export function useReviews(productId: string) {
  const collection = collections.productReviews(productId);

  return useFirestoreCollectionData(query(collection));
}

export function useReview(productId: string, reviewId: string) {
  const collection = collections.productReviews(productId);

  return useFirestoreDoc(doc(collection, reviewId));
}
