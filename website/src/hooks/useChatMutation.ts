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
import { addDoc, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

import { collections, firestore, storage } from '../firebase';
import { useUser } from './useUser';
import { Review } from '../types';

export function useChatMutation(customerId: string): UseMutationResult<any, Error, any> {
  const client = useQueryClient();
  const user = useUser();

  return useMutation(
    async (args: { prompt?: string; contextUpdate?: string }) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      //   if (!user.data) {
      //     throw new Error('This mutation requires authentication.');
      //   }
      // const userData = user.data;
      const documentRef = doc(collections.chat(customerId));

      if (args.contextUpdate) {
        // update context before proceeding
        console.log();
        await updateDoc(doc(firestore, 'customers', customerId), {
          context: args.contextUpdate,
        });
      }

      if (args.prompt) {
        // A user can only have a single review per product, so we use the
        // id to easily identify whether they have already reviewed this product.

        await addDoc(collections.chat(customerId), {
          prompt: args.prompt,
        });
      }

      return documentRef.id;
    },
    {
      onSuccess(reviewId) {
        client.invalidateQueries(['chat', customerId]);
      },
    },
  );
}
