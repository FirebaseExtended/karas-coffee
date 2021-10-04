import { limit, orderBy, QueryConstraint, where } from '@firebase/firestore';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { query } from 'firebase/firestore';
import { UseQueryResult } from 'react-query';
import { collections } from '../firebase';
import { Content } from '../types';

export function useContent(key: string, limitTo?: number): UseQueryResult<Content[]> {
  const collection = collections.content;
  const constraints: QueryConstraint[] = [];

  constraints.push(orderBy('created_at', 'desc'));

  if (limitTo) {
    constraints.push(limit(limitTo));
  }

  return useFirestoreQueryData<Content>([key, 'content'], query(collection, ...constraints));
}

export function useContentItem(id: string): UseQueryResult<Content | null> {
  const collection = collections.content;
  const constraints: QueryConstraint[] = [];

  constraints.push(where('id', '==', id));
  constraints.push(limit(1));

  return useFirestoreQueryData<Content, Content | null>(['content', id], query(collection, ...constraints), undefined, {
    select(data) {
      if (data.length === 0) {
        return null;
      }

      return data[0];
    },
  });
}
