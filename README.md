## Firebase Extensions Demo

A demo ecommerce application showcasing Firebase Extensions and other Firebase products.

To learn more about this project [see the documentation](/docs) or the video below:

[![Build your retail app with Firebase extensions](https://img.youtube.com/vi/nhCbAezbiQ8/0.jpg)](https://www.youtube.com/watch?v=nhCbAezbiQ8)

----
### Project structure

  - [/website](/website)
    - Source for the React web application.  
  - [/functions](/functions)
    - Source for Firebase Cloud Functions used by this project.  
  - [/tools](/tools)
    - Scripts/tools such as Stripe product importing and Cloud Firestore rules.

----
### Local development

```bash
yarn
```

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
       - See the [docs](https://github.com/FirebaseExtended/karas-coffee/blob/main/docs) to learn about the Firebase Extensions used in this project.
 -  💳&nbsp;&nbsp;[Stripe Checkout](https://stripe.com/docs/payments/checkout)
    - Checkout creates a secure, Stripe-hosted payment page that lets you collect payments quickly.
 -  📦&nbsp;&nbsp;[ShipEngine](https://www.shipengine.com/)
    - ShipEngine’s APIs help brands, ecommerce platforms, 3PLs and others save time and money on shipping.
 -  🔍&nbsp;&nbsp;[Algolia Search](https://www.algolia.com/products/search-and-discovery/hosted-search-api/)
    - Enables developers to build next generation apps with composable APIs.
 -  ⚛️&nbsp;&nbsp;[React](https://reactjs.org/)
    - A JavaScript library for building user interfaces.
 -  ⚡️&nbsp;&nbsp;[Vite](https://vitejs.dev/)
    - Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.
