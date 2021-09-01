import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';

import { productConverter } from './converters';

export const firebaseConfig = {
  apiKey: 'AIzaSyCrbVzj7TfFBPjxardH4JTuYFr38CZealM',
  authDomain: 'karas-coffee.firebaseapp.com',
  projectId: 'karas-coffee',
  storageBucket: 'karas-coffee.appspot.com',
  messagingSenderId: '94487412900',
  appId: '1:94487412900:web:b96590557d4383a3fce631',
  measurementId: 'G-M9HH3JL1S7',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

function getCollectionName(name: string) {
  // Leaving here just in-case we want to do dev/prod specific collections.
  return `${name}`;
}

export const collections = {
  products: collection(firestore, getCollectionName('products')).withConverter(productConverter),
};
