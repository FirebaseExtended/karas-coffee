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

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// @ts-expect-error No types for firebase-tools
import * as firebase_tools from 'firebase-tools';

admin.initializeApp();

// Returns a list of all product ids in the database
function getProductIds(): Promise<string[]> {
  return admin
    .firestore()
    .collection('products')
    .listDocuments()
    .then((docRefs) => {
      return docRefs.map((docRef) => docRef.id);
    });
}

// Use Firebase Tools to delete a collection
function deleteCollection(path: string): Promise<void> {
  return firebase_tools.firestore.delete(path, {
    project: 'karas-coffee',
    recursive: true,
    yes: true, // auto-confirmation
  });
}

// Send a welcome email on user create.
exports.onAuthCreate = functions.auth.user().onCreate(async (user: functions.auth.UserRecord) => {
  const collection = admin.firestore().collection('mail');
  await collection.add({ to: user.email, template: { name: 'welcome_email' } });
});

// Send a order update SMS to the user once they have placed an order.
exports.onPaymentCreated = functions.firestore
  .document('customers/{customerId}/payments/{paymentId}')
  .onCreate(async (snapshot, context) => {
    const customerId = context.params.customerId;
    const user = await admin.auth().getUser(customerId);
    if (!user.phoneNumber) {
      functions.logger.log('No phone number found for user, skipping sending update.', user.uid);
      return;
    }
    const message = {
      to: user.phoneNumber,
      body: `Thank you for ordering from Kara's Coffee, your order is currently being processed. You can track it at https://karas-coffee.web.app/account/orders`,
    };
    await admin.firestore().collection('messages').add(message);
  });

// A Firebase function delete all user data every 24 hours - useful only
// for the purpose of this demo so we're not storing user data for long period.
exports.deleteUserData = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const [users, productIds] = await Promise.all([admin.auth().listUsers(), getProductIds()]);

  const bucket = admin.storage().bucket();
  const bucketFiles = (await bucket.getFiles())[0];

  await Promise.all<unknown>([
    deleteCollection('cart'),
    // ShipEngine verify addresses
    deleteCollection('addresses'),
    // Twilio SendGrid
    deleteCollection('cart_emails'),
    // Twilio SMS
    deleteCollection('messages'),
    // Stripe & Firebase Auth
    deleteCollection('customers'),
    // Storage mirror
    deleteCollection('gcs-mirror'),
    // Mailchimp
    deleteCollection('mail'),

    // Delete user reviews
    ...productIds.map((productId) => deleteCollection(`products/${productId}/reviews`)),

    // Delete users from Firebase Auth
    admin.auth().deleteUsers(users.users.map((user) => user.uid)),

    // Delete all storage files
    ...bucketFiles.map((file) => file.delete()),
  ]);
});
