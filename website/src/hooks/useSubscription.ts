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

import { collections } from '../firebase';
import { useUser } from './useUser';
import { QueryConstraint, query, where, limit } from 'firebase/firestore';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { Subscription } from '../types';
import { UseQueryResult } from 'react-query';

export function useSubscription(): UseQueryResult<Subscription | null> {
  const user = useUser();

  if (!user.data) {
    throw new Error('Subscriptions can only be fetched for authenticated users.');
  }

  const collection = collections.subscriptions(user.data.uid);

  const constraints: QueryConstraint[] = [];

  constraints.push(where('status', '==', 'active'));
  constraints.push(limit(1));

  return useFirestoreQueryData<Subscription, Subscription | null>(
    'subscription',
    query(collection, ...constraints),
    undefined,
    {
      select(subscriptions) {
        if (subscriptions.length === 0) {
          return null;
        }

        return subscriptions[0];
      },
    },
  );
}
