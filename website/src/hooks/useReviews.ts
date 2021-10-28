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

import { getDownloadURL } from '@firebase/storage';
import { useFirestoreDocumentData, useFirestoreQueryData } from '@react-query-firebase/firestore';
import { collection, doc, FieldPath, onSnapshot, orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { collections, firestore, storage } from '../firebase';
import { Review } from '../types';
import { useUser } from './useUser';

export const TOXICITY_THRESHOLD = 0.6;

export function useProductReviews(productId: string): UseQueryResult<Review[]> {
  const user = useUser();
  const collection = collections.productReviews(productId);

  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('attribute_scores.TOXICITY'));
  constraints.push(orderBy('created_at', 'desc'));

  // Ensure the record has all the toxicity fields.
  constraints.push(where(new FieldPath('attribute_scores', 'TOXICITY'), '<', TOXICITY_THRESHOLD));

  // For this example, only show the users own reviews.
  constraints.push(where('user.id', '==', user.data?.uid ?? '-'));

  return useFirestoreQueryData(
    ['reviews', productId],
    query(collection, ...constraints),
    {
      subscribe: true,
    },
    {
      enabled: !user.isLoading,
    },
  );
}

export function useProductReview(productId: string, reviewId: string): UseQueryResult<Review> {
  const collection = collections.productReviews(productId);

  return useFirestoreDocumentData(['reviews', productId, reviewId], doc(collection, reviewId), {
    subscribe: true,
  });
}

export function useProductReviewImages(productId: string, userId: string): UseQueryResult<string[]> {
  const client = useQueryClient();
  const key = ['reviews', productId, 'images', userId];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const items = collection(
      firestore,
      'gcs-mirror',
      'karas-coffee.appspot.com',
      'prefixes',
      userId,
      'prefixes',
      'reviews',
      'prefixes',
      productId,
      'items',
    );

    return onSnapshot(items, async (snapshot) => {
      const ids = snapshot.docs.map((doc) => doc.data().gcsMetadata.name);

      const urls = await Promise.all(
        ids.map((id) => {
          return getDownloadURL(ref(storage, id));
        }),
      );

      client.setQueryData(key, urls);
      setReady(true);
    });
  }, [userId, productId]);

  return useQuery<string[]>(
    key,
    () => {
      const data = client.getQueryData<Array<string>>(key);
      return data || [];
    },
    {
      enabled: ready,
    },
  );
}
