# Documentation

Kara's Coffee is a demo application built using a collection of technologies - most importantly Firebase!

These docs explain how the main aspects of the application integrate with Firebase, including Firebase Extensions.

---

## Building the application

Although the application as a whole demonstrates an e-commerce website, there are also individual aspects of it
described in more detail throughout these docs:

- [Syncing products using the Stripe Extension](Syncing-products-using-the-Stripe-Extension.md)
- [Creating an instant search experience with Algolia](Creating-an-instant-search-experience-with-Algolia.md)
- [Building user shopping carts with Firestore](Building-user-shopping-carts-with-Firestore.md)
- [Displaying filterable products using Firestore Queries](Displaying-filterable-products-using-Firestore-Queries.md)
- [Enabling fast product listings using Data Bundles](Enabling-fast-product-listings-using-Data-Bundles.md)
- [Detecting toxic user reviews using the Perspective Toxicity Extension](Detecting-toxic-user-reviews-using-the-Perspective-Toxicity-Extension.md)
- [Integrating with Stripe Checkout](Integrating-with-Stripe-Checkout.md)
- [Validating user addresses and handling shipping rates](Validating-user-addresses-and-handling-shipping-rates.md)


---

## Technologies

### ️‍🔥&nbsp;&nbsp;[Firebase](https://firebase.google.com/)

- 🔑&nbsp;&nbsp;[Firebase Authentication](https://firebase.google.com/docs/auth)
- 📄&nbsp;&nbsp;[Cloud Firestore](https://firebase.google.com/docs/firestore)
- 🌍&nbsp;&nbsp;[Firebase Hosting](https://firebase.google.com/docs/hosting)

---

### ☁️&nbsp;&nbsp;[Firebase Cloud Functions](https://firebase.google.com/products/functions)

- [`onAuthCreate`](https://github.com/invertase/karas-coffee/blob/main/functions/src/index.ts#L45)

  - This function adds a new document to the `mail` collection on new user creation - this collection is listened to
    by the [Firestore Send Email](https://firebase.google.com/products/extensions/firestore-send-email) extension and
    sends a welcome email to the new user.
    - These emails are not actually processed on the hosted live demo website.

- [`onPaymentCreated`](https://github.com/invertase/karas-coffee/blob/main/functions/src/index.ts#L51)

  - This function triggers when a new customer payment has been created and sends an initial order update SMS to the user (if they've set up a
    phone number on their account - entering a user phone number is disabled on the hosted live demo website) via
    the [Twilio Send Message](https://github.com/twilio-labs/twilio-firebase-extensions/tree/main/firestore-send-twilio-message)
    extension by writing to the `messages` collection on Cloud Firestore.

- [`deleteUserData`](https://github.com/invertase/karas-coffee/blob/main/functions/src/index.ts#L69)
  - This scheduled function deletes all user data every 24 hours - it is useful only for the purpose of this demo.

---

### 🧩&nbsp;&nbsp;[Firebase Extensions](https://firebase.google.com/docs/extensions)

- [Delete User Data](https://firebase.google.com/products/extensions/delete-user-data)
  - Automatically delete user data when a Firebase user is deleted.
- [Firestore Bundle Server](https://github.com/FirebaseExtended/experimental-extensions/tree/next/firestore-bundle-server)
  - See [enabling fast product listings using Data Bundles](Enabling-fast-product-listings-using-Data-Bundles.md) to
    learn more.
- [Firestore Send Email](https://firebase.google.com/products/extensions/firestore-send-email)
  - Sends a welcome email upon signup.
- [Firestore Perspective Toxicity](https://github.com/conversationai/firestore-perspective-toxicity)
  - Validates review comments provided by customers to ensure that they are non-toxic, e.g. insults & profanity
    detection.
- [Trigger Email](https://firebase.google.com/products/extensions/firestore-send-email)
- [Algolia - Firestore Algolia Search](https://firebase.google.com/products/extensions/firestore-algolia-search)
  - See [creating an instant search experience with Algolia](Creating-an-instant-search-experience-with-Algolia.md) to
    learn more.
- [Stripe - Firestore Stripe Payments](https://firebase.google.com/products/extensions/firestore-stripe-subscriptions)
  - See the following pages to learn more:
    - [Syncing products using the Stripe Extension](Syncing-products-using-the-Stripe-Extension.md).
    - [Integrating with Stripe Checkout](Integrating-with-Stripe-Checkout.md)
- [ShipEngine - Calculate Shipping Rates](https://github.com/ShipEngine/firebase-extensions/tree/master/extensions/rates)
  - See [validating user addresses and handling shipping rates](Validating-user-addresses-and-handling-shipping-rates.md)
    to learn more.
- [ShipEngine - Purchase Labels](https://github.com/ShipEngine/firebase-extensions/tree/master/extensions/purchase-label)
- [ShipEngine - Validate Address](https://github.com/ShipEngine/firebase-extensions/tree/master/extensions/validate-address)
  - See [validating user addresses and handling shipping rates](Validating-user-addresses-and-handling-shipping-rates.md)
    to learn more.

---

### Other

- 💳&nbsp;&nbsp;[Stripe Checkout](https://stripe.com/docs/payments/checkout)
  - Client library for handling checkout payments.
- 📦&nbsp;&nbsp;[ShipEngine](https://www.shipengine.com/)
  - ShipEngine’s APIs help brands, ecommerce platforms, 3PLs and others save time and money on shipping.
- 🔍&nbsp;&nbsp;[Algolia Search](https://www.algolia.com/products/search-and-discovery/hosted-search-api/)
  - Enables developers to build next generation apps with composable APIs.
- ⚛️&nbsp;&nbsp;[React](https://reactjs.org/)
  - A JavaScript library for building user interfaces.
- ⚡️&nbsp;&nbsp;[Vite](https://vitejs.dev/)
  - Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.
