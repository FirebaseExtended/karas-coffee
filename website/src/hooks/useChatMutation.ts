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
import { addDoc, deleteDoc, doc, getDocs, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

import { collections, firestore, functions, storage } from '../firebase';
import { useUser } from './useUser';
import { Product, Review } from '../types';
import { httpsCallable } from 'firebase/functions';

export function useChatMutation(customerId: string): UseMutationResult<any, Error, any> {
  const client = useQueryClient();
  const user = useUser();

  return useMutation(
    async ({ prompt, searchQuery }: { prompt?: string; searchQuery?: string }) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      //   if (!user.data) {
      //     throw new Error('This mutation requires authentication.');
      //   }
      // const userData = user.data;
      const documentRef = doc(firestore, 'customers', customerId);

      let context: string = await getContext({});

      if (searchQuery) {
        const vectorSearch = httpsCallable(functions, 'ext-firestore-vector-search-queryCallable');

        const { data } = await vectorSearch({
          query: searchQuery,
          limit: 6,
        });
        // @ts-ignore
        console.log('SEARCH RESULTS', data.ids);

        // @ts-ignore
        const q = query(collections.products, where('id', 'in', data.ids));

        const vectorSearchProducts = await getDocs(q);

        console.log(
          'SEARCH PRODUCTS',
          vectorSearchProducts.docs.map((doc) => doc.data()),
        );

        context = await getContext({
          vectorSearchResults: vectorSearchProducts.docs.map((doc) => doc.data() as Product),
        });
      }
      // update context before proceeding
      await updateDoc(doc(firestore, 'customers', customerId), {
        context,
      });

      if (prompt) {
        await addDoc(collections.chat(customerId), {
          prompt,
        });
      }

      if (!prompt && !searchQuery) {
        // clear chat collection
        const chatCollection = await getDocs(collections.chat(customerId));

        chatCollection.forEach(async (doc) => {
          await deleteDoc(doc.ref);
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

async function getContext({ vectorSearchResults }: { vectorSearchResults?: Product[] }) {
  let context = `
  You are an AI customer assistant for a business called Kara's Coffee.
  Your name is Karabot.
  You will helpful and friendly to customers.
  Your job is to help customers find the best products to suit their needs.
  You will also help customers with any questions they have about the products.
  
  It is very important that you do not give the customer any incorrect information. 
  \n
  `;
  // TODO: make sure this info is correct
  const noFurtherInformationAvailableContext = `
  Currently we have no information on this customer. Ask a clarifying question to see what product they might be interested in.
  `;

  if (vectorSearchResults && vectorSearchResults.length > 0) {
    const formattedVectorSearchResults = formatProducts(vectorSearchResults);

    const vectorSearchResultsContext = `
    Here are the products that match the customers search:

    NAME,TYPE,DESCRIPTION,PRICE,ORIGIN,STRENGTH,VARIETY
    ${formattedVectorSearchResults}
    `;

    context += vectorSearchResultsContext;
  } else {
    context += noFurtherInformationAvailableContext;
  }

  const suffix = `
  Do not provide information about these products that is not available in the above CSV(s), for example if a customer asks "what color is the product?" and
  the color is not described anywhere in the product's row, then you **must** answer "I'm sorry, I don't have that information".

  If a product is of type "subscription", then the price is per month.
  `;

  context += suffix;

  return context;
}

const formatProducts = (products: Product[]) =>
  products
    .map(
      ({ name, metadata, description }) =>
        `${name}, ${metadata.type}, ${description}, ${metadata.price_usd}, ${
          metadata.type !== 'coffee' ? 'N/A' : metadata.origin
        }, ${metadata.type !== 'coffee' ? 'N/A' : metadata.strength},${
          metadata.type !== 'coffee' ? 'N/A' : metadata.variety
        }`,
    )
    .join('\n');
