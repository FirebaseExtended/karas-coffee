## Firebase Functions

Firebase Cloud Functions for the demo application.

### `onAuthCreate`

This function adds a new document to the `mail` collection on new user creation - this collection is listened to by the [Firestore Send Email](https://firebase.google.com/products/extensions/firestore-send-email) extension
and sends a welcome email to the new user.

### `onPaymentCreated`

This function triggers on new order create and sends an initial order update SMS to the user (if they've setup a phone number on their account) via the [Twilio Send Message](https://github.com/twilio-labs/twilio-firebase-extensions/tree/main/firestore-send-twilio-message) extension by writing to the `messages` collection on Cloud Firestore.

### `deleteUserData`

This scheduled function deletes all user data every 24 hours - useful only for the purpose of this demo.
