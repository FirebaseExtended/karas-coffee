## Firebase Extensions Demo

A demo ecommerce application showcasing Firebase Extensions and other Firebase products.

----
### Project structure

  - [/](/)
    - Source for the React web application, see [/src](/src).  
  - [/functions](/functions)
    - Source for Firebase Cloud Functions used by this project.  
  - [/tools](/tools)
    - Scripts/tools such as Stripe product importing and Cloud Firestore rules.

----
### Local development


#### Running locally

```bash
yarn dev
```

#### Deploying to Firebase Hosting

```bash
yarn deploy
```

#### Importing product data into Stripe

```bash
cd tools
yarn stripe:import-products
```

Note: this script requires you create a `tools/.env` file with your `STRIPE_SECRET_KEY` set in it.

#### Deploy Firestore rules

```bash
cd tools
yarn firebase:deploy-firestore-rules
```

----

### Technologies Used

 -  ️‍🔥&nbsp;&nbsp;[Firebase](https://firebase.google.com/) 
    -  🔑&nbsp;&nbsp;[Firebase Authentication](https://firebase.google.com/docs/auth)
    -  📄&nbsp;&nbsp;[Cloud Firestore](https://firebase.google.com/docs/firestore)
    -  🌍&nbsp;&nbsp;[Firebase Hosting](https://firebase.google.com/docs/hosting)
    -  🧩&nbsp;&nbsp;[Firebase Extensions](https://firebase.google.com/docs/extensions)
       - [Delete User Data](https://firebase.google.com/products/extensions/delete-user-data)
       - [Firestore Algolia Search](https://firebase.google.com/products/extensions/firestore-algolia-search)
       - [Firestore Send Email](https://firebase.google.com/products/extensions/firestore-send-email)
       - [Firestore Stripe Payments](https://firebase.google.com/products/extensions/firestore-stripe-subscriptions)
       - [Firestore Perspective Toxicity](https://github.com/conversationai/firestore-perspective-toxicity)
 -  💳&nbsp;&nbsp;[Stripe Checkout](https://stripe.com/docs/payments/checkout)
 -  🔍&nbsp;&nbsp;[Algolia Search](https://www.algolia.com/products/search-and-discovery/hosted-search-api/)
 -  ⚛️&nbsp;&nbsp;[React](https://reactjs.org/)
 -  ⚡️&nbsp;&nbsp;[Vite](https://vitejs.dev/)
