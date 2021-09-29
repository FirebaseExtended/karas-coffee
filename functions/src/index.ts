import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// @ts-expect-error No types for firebase-tools
import * as firebase_tools from 'firebase-tools';

admin.initializeApp();

exports.onAuthCreate = functions.auth.user().onCreate(async (user: any) => {
  const collection = admin.firestore().collection('mail');
  await collection.add({ to: user.email, template: { name: 'welcome_email' } });
});

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

exports.deleteUserData = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const [users, productIds] = await Promise.all([admin.auth().listUsers(), getProductIds()]);

  // TODO: Delete all storage data
  // const bucket = admin.storage().bucket();

  await Promise.all([
    deleteCollection('cart'),
    deleteCollection('customers'),
    deleteCollection('gcs-mirror'),
    deleteCollection('mail'),
    admin.auth().deleteUsers(users.users.map((user) => user.uid)),
    ...productIds.map((productId) => deleteCollection(`products/${productId}/reviews`)),
  ]);
});
