import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

import { productConverter, customerConverter, sessionConverter, reviewConverter } from './converters';

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
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdTwWccAAAAAM4QOoaqFiVW9j6yy9AOetWVCzeN'),
  isTokenAutoRefreshEnabled: true,
});

export const collections = {
  products: collection(firestore, 'products').withConverter(productConverter),
  customers: collection(firestore, 'customers').withConverter(customerConverter),
  // TODO(ehesp): Add converter once schema agreed.
  cart: collection(firestore, 'cart'),
  sessions: (customerId: string) =>
    collection(firestore, 'customers', customerId, 'checkout_sessions').withConverter(sessionConverter),
  payments: (customerId: string) =>
    collection(firestore, 'customers', customerId, 'payments').withConverter(sessionConverter),
  productReviews: (productId: string) =>
    collection(firestore, 'products', productId, 'reviews').withConverter(reviewConverter),
};
