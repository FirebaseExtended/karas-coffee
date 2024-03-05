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
import { Product } from '../types';
import { httpsCallable } from 'firebase/functions';
import { usePurchaseHistory } from './usePurchaseHistory';

export function useChatMutation(): UseMutationResult<any, Error, any> {
  const client = useQueryClient();
  const user = useUser();

  const uid = user.data?.uid;
  // const purchaseHistoryResult = usePurchaseHistory(['purchaseHistory', uid], uid);

  return useMutation(
    async ({ prompt, searchQuery }: { prompt?: string; searchQuery?: string }) => {
      // Soft validation - the Firestore security rules ensure they are
      // authenticated.
      if (!user.data) {
        throw new Error('This mutation requires authentication.');
      }
      const uid = user.data.uid;
      const documentRef = doc(firestore, 'customers', uid);

      let purchaseHistory: Product[] = [];

      // if (purchaseHistoryResult.data) {
      //   purchaseHistory = purchaseHistoryResult.data;
      // }

      let context: string = await getContext({ purchaseHistory });

      if (searchQuery) {
        const vectorSearch = httpsCallable(functions, 'ext-firestore-vector-search-queryCallable');

        const { data } = await vectorSearch({
          query: searchQuery,
          limit: 6,
        });
        console.log('gets to here');
        // @ts-ignore
        const q = data.ids ? query(collections.products) : query(collections.products, where('id', 'in', data.ids));

        const vectorSearchProducts = await getDocs(q);

        context = await getContext({
          vectorSearchResults: vectorSearchProducts.docs.map((doc) => doc.data() as Product),
          purchaseHistory: purchaseHistory,
        });
      }
      // update context before proceeding
      await setDoc(doc(firestore, 'customers', uid), {
        context,
      });

      if (prompt) {
        await addDoc(collections.chat(uid), {
          prompt,
        });
      }

      if (!prompt && !searchQuery) {
        // clear chat collection
        const chatCollection = await getDocs(collections.chat(uid));

        chatCollection.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }

      return documentRef.id;
    },
    {
      onSuccess(reviewId) {
        client.invalidateQueries(['chat', user.data?.uid]);
      },
    },
  );
}

async function getContext({
  vectorSearchResults,
  purchaseHistory,
}: {
  vectorSearchResults?: Product[];
  purchaseHistory?: Product[];
}) {
  let context = `You are an AI customer assistant for a business called Kara's Coffee. \\n
  Your name is Karabot. \\n
  You will be helpful and friendly to customers. \\n
  Your job is to help customers find the best products to suit their needs and answer any questions they have about our products accurately. \\n
  Always ensure the information you provide is accurate and refrain from guessing. \\n
  `;

  if (vectorSearchResults && vectorSearchResults.length > 0) {
    const formattedVectorSearchResults = formatProducts(vectorSearchResults);

    context += `
    Here are the products that match the customer's search: \\n
    ---\\n
    NAME, TYPE, DESCRIPTION, PRICE, ORIGIN, STRENGTH, VARIETY \\n
    ${formattedVectorSearchResults}\\n
    ---\\n
    `;
  }

  if (purchaseHistory && purchaseHistory.length > 0) {
    const formattedPurchaseHistory = formatProducts(purchaseHistory);

    context += `
    \\n
    These are the customers previous purchases: \\n
    ---\\n
    NAME, TYPE, DESCRIPTION, PRICE, ORIGIN, STRENGTH, VARIETY \\n
    ${formattedPurchaseHistory} \\n
    ---\\n
    `;
  }

  if ((!vectorSearchResults || vectorSearchResults.length == 0) && (!purchaseHistory || purchaseHistory.length == 0)) {
    context += `
    Currently, we have no specific information about the customer's preferences. Ask the customer to tell you more about the types of coffee or products they are interested in.
    `;
  }

  context += `
  If a customer asks about details not mentioned here, such as color, kindly respond with, "I'm sorry, I don't have that information. Can I assist you with other details like the coffee's origin or strength?" Offer alternative help or suggest related products. \\n

  If the product is a subscription, remember that the listed price is per month. \\n

  When you reply, reply **ONLY** in plain text please. Do not use markdown or CSV in your messages to the customer. \\n

  Always ensure the information you provide is accurate and refrain from guessing. Do not mention any products that are not listed in this message.\\n

  The categories of products we sell are coffee beans, coffee machines, and coffee subscriptions. We do not sell grinders. If we sell an item, it will be listed in this conversation already.\\n

  The conversation will start imminently. Prepare to be engaging and informative. \\n
  `;

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
    .join('\\n');
