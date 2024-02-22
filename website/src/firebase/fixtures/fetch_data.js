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

// import { initializeApp } from 'firebase/app';
const admin = require('firebase-admin');
// import * as fs from 'fs';
const fs = require('fs');
// import { getAnalytics } from 'firebase/analytics';
// import { getFirestore, collection, connectFirestoreEmulator, getDocs } from 'firebase/firestore';

// import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCEtg_FqMZAQ8zTMG34-EgUyv-x5rS9Ibg',
//   authDomain: 'fir-vector-invertase-03.firebaseapp.com',
//   projectId: 'fir-vector-invertase-03',
//   storageBucket: 'fir-vector-invertase-03.appspot.com',
//   messagingSenderId: '67051307990',
//   appId: '1:67051307990:web:a62c5d554f7d028a2b9a77',
// };

const adminApp = admin.initializeApp({ projectId: 'karas-coffee-invertase' });

const karasFirestore = adminApp.firestore();

const fetchCollectionAndWriteToFile = async (collectionName, outputFilePath) => {
  try {
    const snapshot = await karasFirestore.collection(collectionName).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    fs.writeFile(outputFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Failed to write to file:', err);
        return;
      }
      console.log(`Collection data written to ${outputFilePath}`);
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
  }
};

const cwd = process.cwd();

const getCollectionFilePath = (collectionName) => `${cwd}/${collectionName}.json`;

const collectionNames = ['bundles', 'content', 'notices', 'products', 'templates', 'urls'];

for (const collectionName of collectionNames) {
  fetchCollectionAndWriteToFile(collectionName, getCollectionFilePath(collectionName));
}

// fetchCollectionAndWriteToFile('products', productsFilePath);

// const app = initializeApp(firebaseConfig);
// // export const analytics = getAnalytics(app);
// const firestore = getFirestore(app);
// connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

// const functions = getFunctions(app);
// connectFunctionsEmulator(functions, '127.0.0.1', 5001);

// const collections = {
//   products: collection(firestore, 'products'),
//   customers: collection(firestore, 'customers'),
//   // TODO(ehesp): Add converter once schema agreed.
//   cart: collection(firestore, 'cart'),
//   sessions: (customerId) => collection(firestore, 'customers', customerId, 'checkout_sessions'),
//   payments: (customerId) => collection(firestore, 'customers', customerId, 'payments'),
//   subscriptions: (customerId) => collection(firestore, 'customers', customerId, 'subscriptions'),
//   invoices: (customerId, subscriptionId) => {
//     return collection(collections.subscriptions(customerId), subscriptionId, 'invoices');
//   },
//   productReviews: (productId) => collection(firestore, 'products', productId, 'reviews'),
//   content: collection(firestore, 'content'),
//   addresses: (customerId) => collection(firestore, 'customers', customerId, 'addresses'),
// };

// getDocs(collections.products)
//   .then((querySnapshot) => {
//     console.log('Number of documents fetched: ', querySnapshot.size);

//     querySnapshot.forEach((doc) => {
//       console.log(JSON.stringify(doc.data()));
//     });
//     console.log('done');
//     process.exit(0);
//   })
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   });
