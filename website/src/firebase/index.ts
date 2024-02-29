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
} from './converters';

const firebaseConfig = {
  apiKey: 'AIzaSyCEtg_FqMZAQ8zTMG34-EgUyv-x5rS9Ibg',
  authDomain: 'fir-vector-invertase-03.firebaseapp.com',
  projectId: 'fir-vector-invertase-03',
  storageBucket: 'fir-vector-invertase-03.appspot.com',
  messagingSenderId: '67051307990',
  appId: '1:67051307990:web:a62c5d554f7d028a2b9a77',
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

connectFirestoreEmulator(firestore, 'localhost', 8080);

export const storage = getStorage(app);
export const functions = getFunctions(app);

connectFunctionsEmulator(functions, 'localhost', 5001);

connectAuthEmulator(auth, 'http://localhost:9099');

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
  purchaseHistory: (customerId: string) => collection(firestore, 'customers', customerId, 'purchaseHistory'),
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
