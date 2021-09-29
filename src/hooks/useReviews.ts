import { getDownloadURL } from '@firebase/storage';
import { useFirestoreDocumentData, useFirestoreQueryData } from '@react-query-firebase/firestore';
import { collection, doc, FieldPath, onSnapshot, orderBy, query, QueryConstraint, where } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { app, collections, firestore, storage } from '../firebase';
import { useUser } from './useUser';

export const TOXICITY_THRESHOLD = 0.6;

export function useProductReviews(productId: string) {
  const user = useUser();
  const collection = collections.productReviews(productId);

  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('attribute_scores.TOXICITY'));
  constraints.push(orderBy('created_at', 'desc'));

  // Ensure the record has all the toxicity fields.
  constraints.push(where(new FieldPath('attribute_scores', 'TOXICITY'), '<', TOXICITY_THRESHOLD));

  // In production, only show the users own reviews.
  // @ts-expect-error
  if (import.meta.PROD && !!user.data) {
    constraints.push(where('user.id', '==', user.data.uid));
  }

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

export function useProductReview(productId: string, reviewId: string) {
  const collection = collections.productReviews(productId);

  return useFirestoreDocumentData(['reviews', productId, reviewId], doc(collection, reviewId), {
    subscribe: true,
  });
}

export function useProductReviewImages(productId: string, userId: string) {
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

  return useQuery<Array<string>>(
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
