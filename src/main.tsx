import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadBundle } from 'firebase/firestore';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'tailwindcss/tailwind.css';

import { App } from './App';
import { firestore } from './firebase';
import { getUserOnce } from './firebase/auth';

const client = new QueryClient();

async function bootstrap(): Promise<void> {
  client.setQueryData('user', await getUserOnce());

  // Define any bundles to pre-load.
  const bundles = await Promise.all([fetch('/bundles/shop')]);

  // Load the bundles into Firestore.
  await Promise.all(bundles.map((bundle) => loadBundle(firestore, bundle.body!)));
}

bootstrap().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={client}>
          <>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});
