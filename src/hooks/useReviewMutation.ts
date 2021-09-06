import { useCallback } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { collections } from '../firebase';
import { useUser } from './useUser';
import { Review } from '../types';

export function useReviewMutation(productId: string) {
  const user = useUser();

  return useCallback(
    async (review: Pick<Review, 'rating' | 'message'>) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      if (!user) {
        throw new Error('This mutation requires authentication.');
      }

      // A user can only have a single review per product, so we use the
      // id to easily identify whether they have already reviewed this product.
      const ref = doc(collections.productReviews(productId), user.uid);

      return setDoc(ref, {
        id: ref.id,
        created_at: Timestamp.now(),
        product_id: productId,
        rating: review.rating,
        message: review.message,
        user: {
          id: user.uid,
          display_name: user.displayName ?? user.email ?? user.uid,
          photo_url: user.photoURL ?? '',
        },
        attribute_scores: null as any, // Unused - created by Extension used to satisfy TypeScript
      });
    },
    [user, productId],
  );
}
