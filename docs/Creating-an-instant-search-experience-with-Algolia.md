Algolia is a service which enables developers to build blazing fast instant search experiences for users. This is
achieved by indexing data on the service.

The [Firestore Search with Algolia](https://www.algolia.com/developers/firebase-search-extension/) extension enables
Firestore documents to be synced to the Algolia service.

## Configuration

Once configured to sync the `products` collection and the extension is installed, any documents added to the `products` collection will automatically sync to our Algolia project. You can
read more about how these products are added by reading
the [adding stripe products](https://github.com/FirebaseExtended/karas-coffee/blob/main/docs/Syncing-products-using-the-Stripe-Extension.md) documentation.

![image](https://user-images.githubusercontent.com/2060661/139304383-873b0064-44f0-4147-889b-7db5ed95f0ae.png)

## Building the UI

Using the [`react-instantsearch-dom`](https://github.com/algolia/react-instantsearch) SDK by Algolia, we were able to
quickly build a custom search UI. The SDK does all the hard work for us, and by defining our `input` element along with
a UI for each search result row, we're able to build an instant search experience.

## Resources

- [Search Component](https://github.com/firebaseExtended/karas-coffee/blob/main/website/src/components/Search.tsx).
- [Algolia](https://www.algolia.com/)
- [Firestore Search with Algolia](https://www.algolia.com/developers/firebase-search-extension/)
