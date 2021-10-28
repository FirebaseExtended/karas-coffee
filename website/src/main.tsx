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

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'tailwindcss/tailwind.css';

import { App } from './App';
import { loadBundle } from 'firebase/firestore';
import { firestore } from './firebase';
import { CookiePolicy } from './components/CookiePolicy';

const client = new QueryClient();

async function bootstrap(): Promise<void> {
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
            <CookiePolicy />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});
