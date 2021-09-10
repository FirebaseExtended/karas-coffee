import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FirebaseAppProvider, FirestoreProvider } from 'reactfire';

import 'tailwindcss/tailwind.css';

import { App } from './App';
import { firebaseConfig, firestore } from './firebase';
import { getUserOnce } from './firebase/auth';
import { CartProvider } from './components/Cart';

type Bootstrap = {
  user: User | null;
};

async function bootstrap(): Promise<Bootstrap> {
  const user = await getUserOnce();

  // TODO(ehesp): Preload firestore bundles.

  return { user };
}

bootstrap().then(({ user }) => {
  ReactDOM.render(
    <React.StrictMode>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <FirestoreProvider sdk={firestore}>
          <BrowserRouter>
            <App initialUser={user} />
          </BrowserRouter>
        </FirestoreProvider>
      </FirebaseAppProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});
