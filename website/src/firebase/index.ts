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

import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFirestore, collection, CollectionReference, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { Session, Review, Subscription } from '../types';

import {
  productConverter,
  customerConverter,
  sessionConverter,
  reviewConverter,
  subscriptionConverter,
  contentConverter,
  addressConverter,
  purchaseHistoryConverter,
} from './converters';

const firebaseConfig = {
  apiKey: 'AIzaSyBLIkO1bg0Z-O3oTpdJFjXnvWx68iaTt0U',
  authDomain: 'karas-coffee-fvs-01.firebaseapp.com',
  projectId: 'karas-coffee-fvs-01',
  storageBucket: 'karas-coffee-fvs-01.appspot.com',
  messagingSenderId: '1023289608637',
  appId: '1:1023289608637:web:f9050a9d0673d610216ad4',
  measurementId: 'G-YPCM9DSGC4',
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const storage = getStorage(app);
export const functions = getFunctions(app);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const collections = {
  products: collection(firestore, 'products').withConverter(productConverter),
  customers: collection(firestore, 'customers').withConverter(customerConverter),
  // TODO(ehesp): Add converter once schema agreed.
  cart: collection(firestore, 'cart'),
  sessions: (customerId: string): CollectionReference<Session> =>
    collection(firestore, 'customers', customerId, 'checkout_sessions').withConverter(sessionConverter),
  payments: (customerId: string): CollectionReference => collection(firestore, 'customers', customerId, 'payments'),
  subscriptions: (customerId: string): CollectionReference<Subscription> =>
    collection(firestore, 'customers', customerId, 'subscriptions').withConverter(subscriptionConverter),
  purchaseHistory: (customerId: string) =>
    collection(firestore, 'customers', customerId, 'purchaseHistory').withConverter(purchaseHistoryConverter),
  invoices: (customerId: string, subscriptionId: string): CollectionReference => {
    return collection(collections.subscriptions(customerId), subscriptionId, 'invoices');
  },
  productReviews: (productId: string): CollectionReference<Review> =>
    collection(firestore, 'products', productId, 'reviews').withConverter(reviewConverter),
  content: collection(firestore, 'content').withConverter(contentConverter),
  addresses: (customerId: string) =>
    collection(firestore, 'customers', customerId, 'addresses').withConverter(addressConverter),
  chat: (customerId: string) => collection(firestore, 'customers', customerId, 'chat'),
};
