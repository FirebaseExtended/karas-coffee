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

import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { collections, firestore } from '../firebase';
import { useUser } from './useUser';

export function useChatContextMutation(customerId: string): UseMutationResult<string, Error> {
  const client = useQueryClient();
  const user = useUser();

  return useMutation(
    //   TODO: fix any
    async (context: any) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      //   if (!user.data) {
      //     throw new Error('This mutation requires authentication.');
      //   }

      //   const userData = user.data;

      const documentRef = doc(collections.chat(customerId));
      console.log();
      await updateDoc(doc(firestore, 'customers', customerId), {
        context,
      });

      return documentRef.id;
    },
    {
      onSuccess() {
        client.invalidateQueries(['chat', customerId]);
      },
    },
  );
}
