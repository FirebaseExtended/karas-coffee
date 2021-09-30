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
function deleteCollection(path: string): Promise<any> {
  return firebase_tools.firestore.delete(path, {
    project: 'karas-coffee',
    recursive: true,
    yes: true, // auto-confirmation
  });
}

// A Firebase function to send a welcome email on user create.
exports.onAuthCreate = functions.auth.user().onCreate(async (user: any) => {
  const collection = admin.firestore().collection('mail');
  await collection.add({ to: user.email, template: { name: 'welcome_email' } });
});

// A Firebase function delete all user data every 24 hours - useful only
// for the purpose of this demo so we're not storing user data for long period.
exports.deleteUserData = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const [users, productIds] = await Promise.all([admin.auth().listUsers(), getProductIds()]);

  const bucket = admin.storage().bucket();
  const bucketFiles = (await bucket.getFiles())[0];

  await Promise.all([
    deleteCollection('cart'),
    // ShipEngine verify addresses
    deleteCollection('addresses'),
    // Twilio SendGrid
    deleteCollection('cart_email'),
    // Twilio
    deleteCollection('notifications'),
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
