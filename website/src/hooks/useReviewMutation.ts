/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { v4 as uuid } from 'uuid';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

import { collections, storage } from '../firebase';
import { useUser } from './useUser';
import { Review } from '../types';

type ReviewMutation = Pick<Review, 'rating' | 'message' | 'files'>;

export function useReviewMutation(productId: string): UseMutationResult<string, Error, ReviewMutation> {
  const client = useQueryClient();
  const user = useUser();

  return useMutation<string, Error, ReviewMutation>(
    async (review) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      if (!user.data) {
        throw new Error('This mutation requires authentication.');
      }

      const userData = user.data;

      // A user can only have a single review per product, so we use the
      // id to easily identify whether they have already reviewed this product.
      const documentRef = doc(collections.productReviews(productId), userData.uid);

      type UploadTask = () => Promise<void>;
      const uploads: UploadTask[] = [];

      review.files?.forEach((file) => {
        uploads.push(async () => {
          const storageRef = ref(storage, `${userData.uid}/reviews/${productId}/${uuid()}`);
          await uploadBytes(storageRef, file, {
            contentType: file.type,
            customMetadata: {
              uuid: userData.uid,
              name: file.name,
            },
          });
        });
      });

      await Promise.all([
        setDoc(documentRef, {
          id: documentRef.id,
          created_at: Timestamp.now(),
          product_id: productId,
          rating: review.rating,
          message: review.message,
          user: {
            id: userData.uid,
            display_name: userData.displayName ?? userData.email ?? userData.uid,
            photo_url: userData.photoURL ?? '',
          },
          attribute_scores: null,
        }),
        ...uploads.map((task) => task()),
      ]);

      return documentRef.id;
    },
    {
      onSuccess(reviewId) {
        client.invalidateQueries(['reviews', productId, reviewId]);
      },
    },
  );
}
