import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { collections } from '../firebase';
import { useUser } from './useUser';
import { Review } from '../types';

type ReviewMutation = Pick<Review, 'rating' | 'message'>;

export function useReviewMutation(productId: string) {
  const client = useQueryClient();
  const user = useUser();

  return useMutation<string, Error, ReviewMutation>(
    async (review) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      if (!user.data) {
        throw new Error('This mutation requires authentication.');
      }

      // A user can only have a single review per product, so we use the
      // id to easily identify whether they have already reviewed this product.
      const ref = doc(collections.productReviews(productId), user.data.uid);

      await setDoc(ref, {
        id: ref.id,
        created_at: Timestamp.now(),
        product_id: productId,
        rating: review.rating,
        message: review.message,
        user: {
          id: user.data.uid,
          display_name: user.data.displayName ?? user.data.email ?? user.data.uid,
          photo_url: user.data.photoURL ?? '',
        },
        attribute_scores: null as any, // Unused - created by Extension used to satisfy TypeScript
      });

      return ref.id;
    },
    {
      onSuccess(reviewId) {
        client.invalidateQueries(['reviews', productId, reviewId]);
      },
    },
  );
}
