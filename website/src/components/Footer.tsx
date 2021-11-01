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
import { Alert } from './Alert';

export function Footer() {
  return (
    <footer className="mt-16 py-16 border-t">
      <div className="px-6 max-w-7xl mx-auto text-center lg:text-left lg:grid grid-cols-4 gap-24">
        <div className="col-start-1 col-end-3">
          <p className="text-gray-500">
            Kara&apos;s Coffee is an demo E-Commerce and Stripe application, showcasing various Firebase Extensions,
            integrations with Firebase services and more. Learn more by visiting the GitHub repository.
          </p>
          <div className="mt-8">
            <Alert type="warning">The data for this application is reset every 24 hours!</Alert>
          </div>
        </div>
        <div className="mt-16 lg:mt-0 flex flex-col space-y-2">
          <Heading>Extensions</Heading>
          <ul role="list" className="mt-4 space-y-4">
            <li>
              <Link to="https://firebase.google.com/products/extensions/delete-user-data">Delete User Data</Link>
            </li>
            <li>
              <Link to="https://github.com/FirebaseExtended/experimental-extensions/tree/next/firestore-bundle-server">
                Firestore Bundle Server
              </Link>
            </li>
            <li>
              <Link to="https://firebase.google.com/products/extensions/firestore-algolia-search">
                Firestore Algolia Search
              </Link>
            </li>
            <li>
              <Link to="https://firebase.google.com/products/extensions/firestore-send-email">
                Firestore Send Email
              </Link>
            </li>
            <li>
              <Link to="https://firebase.google.com/products/extensions/firestore-stripe-subscriptions">
                Firestore Stripe Subscriptions
              </Link>
            </li>
            <li>
              <Link to="https://github.com/conversationai/firestore-perspective-toxicity">
                Firestore Perspective Toxicity
              </Link>
            </li>
            <li>
              <Link to="https://github.com/ShipEngine/firebase-extensions/tree/master/extensions/rates">
                ShipEngine - Calculate Shipping Rates
              </Link>
            </li>
            <li>
              <Link to="https://github.com/ShipEngine/firebase-extensions/tree/master/extensions/purchase-label">
                ShipEngine - Purchase Labels
              </Link>
            </li>
            <li>
              <Link to="https://github.com/ShipEngine/firebase-extensions/tree/master/extensions/validate-address">
                ShipEngine - Validate Address
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-16 lg:mt-0 flex flex-col space-y-2">
          <Heading>Firebase</Heading>
          <ul role="list" className="mt-4 space-y-4">
            <li>
              <Link to="https://console.firebase.google.com/">Firebase Console</Link>
            </li>
            <li>
              <Link to="https://firebase.google.com/products-build">Build</Link>
            </li>
            <li>
              <Link to="https://firebase.google.com/products-release">Release</Link>
            </li>
            <li>
              <Link to="https://firebase.google.com/products-engage">Engage</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center mt-10 space-x-6 text-gray-600">
        <Link to="https://policies.google.com/privacy?hl=en-GB&fg=1">Privacy</Link>
        <span>&bull;</span>
        <Link to="https://policies.google.com/terms?hl=en-GB&fg=1">Terms</Link>
      </div>
    </footer>
  );
}

function Heading({ children }: { children: string }) {
  return <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">{children}</h3>;
}

function Link({ to, children }: { to: string; children: string }) {
  return (
    <a href={to} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900">
      {children}
    </a>
  );
}
