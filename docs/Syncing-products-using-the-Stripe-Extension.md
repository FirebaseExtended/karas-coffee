Products can be automatically imported using Stripe webhooks.

---

## Configuration

Stripe has provided a helpful guide on setting up products that can synchronise with subscriptions and Firebase
See [Run Payments with Stripe extension](https://github.com/stripe/stripe-firebase-extensions/blob/next/firestore-stripe-payments/POSTINSTALL.md)
for more information.

Once configured the products will then be available to query via the chosen collection on setup, this is by default
the `products` collection.

---

## Building the UI

See [Displaying filterable products](Displaying-filterable-products-using-Firestore-Queries.md) for
displaying products in the UI.

---

## Resources

- [Configure Stripe webhooks](https://github.com/stripe/stripe-firebase-extensions/blob/next/firestore-stripe-payments/POSTINSTALL.md)
