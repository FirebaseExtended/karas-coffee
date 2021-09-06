import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();

exports.onAuthCreate = functions.auth.user().onCreate(async (user: any) => {
  const collection = admin.firestore().collection('mail');
  await collection.add({ to: user.email, template: { name: 'welcome_email' } });

  return Promise.resolve();
});
