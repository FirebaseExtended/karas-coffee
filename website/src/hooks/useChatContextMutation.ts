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
import { Product } from '../types';

const formatProducts: (products: Product[]) => string = (products) => {
  // Format the products into a csv string

  const filterMetadata = (metadata: any) => ({
    type: metadata.type,
    origin: metadata.origin || 'N/A',
    strength: metadata.roast || 'N/A',
    variety: metadata.variety || 'N/A',
  });

  return products
    .map((product) => {
      const metadata = filterMetadata(product.metadata);
      return `${product.name}, ${metadata.type}, ${product.description}, ${product.metadata.price_usd}, ${metadata.origin}, ${metadata.strength}, ${metadata.variety}
      )}`;
    })
    .join('\n');
};

const getContext = (products: Product[]) => {
  return `You are an AI customer assistant for a
    business called "Karas Coffee". Your name is Karabot. This business sells coffee beans and coffee-related products.
    You will be chatting with a customer who is interested in purchasing a product.
    Here is a list of products relevant to the customer you are chatting to:
    \n
    NAME,TYPE,DESCRIPTION,PRICE,ORIGIN,ROAST,VARIETY
    ${products && products.length ? formatProducts(products) : ''}
    \n
    When recommending products, stick to this list. Be kind and helpful to the customer.
    
    Do _NOT_ make up information that isnt present in the above list. The most **important** thing is to be accurate to this data.
    
    If the above list is empty, you should just ask more the customer more clarifying questions.

    For example, do not mention anything about the size or weight of the coffee bags, this is not information you are provided with. If the customer asks about this, you should respond with "I'm sorry, I don't have that information."
    `;
};
export function useChatContextMutation(customerId: string): UseMutationResult<string, Error> {
  const client = useQueryClient();
  const user = useUser();

  return useMutation(
    //   TODO: fix any
    async (vectorSearchResults: any) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      //   if (!user.data) {
      //     throw new Error('This mutation requires authentication.');
      //   }

      //   const userData = user.data;

      const documentRef = doc(collections.chat(customerId));

      console.log('RESULTS', vectorSearchResults);

      await updateDoc(doc(firestore, 'customers', customerId), {
        context: getContext(vectorSearchResults),
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
