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
