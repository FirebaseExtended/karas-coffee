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

import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { query, QueryConstraint, Query } from 'firebase/firestore';
import { QueryKey, UseQueryResult } from 'react-query';
import { collections } from '../firebase';
import { Product } from '../types';

function isQueryConstraints(value: unknown): value is QueryConstraint[] {
  return Array.isArray(value);
}

export function usePurchaseHistory(key: QueryKey, uid?: string): UseQueryResult<Product[]> {
  const collection = uid ? collections.purchaseHistory(uid) : collections.products;
  let ref: Query<Product>;

  ref = query(collection);

  return useFirestoreQueryData<Product>(
    key,
    ref,
    {
      subscribe: true,
    },
    { enabled: !!uid },
  );
}
