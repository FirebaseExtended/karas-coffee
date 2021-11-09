Connect Firestore with a synchronised Stripe Checkout.

A checkout `url` will be generated for redirecting users to their specific checkout instance within Stripe.

---

## Configuration

Using
the [Stripe Subscriptions Extension](https://firebase.google.com/products/extensions/firestore-stripe-subscriptions?authuser=0)
a collection can be defined called a `checkout_session`.

This will manage synced checkout information between Firestore and Stripe including:

- Line items
- Customer
- Session ID
- Url
- Cancel Url

In addition, Stripe requires a client library to be available on the website. This can be configured with the following
snippet:

```js
import Stripe from "stripe";

import {env} from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
```

Your personal Stripe `secret key` will be required for installation.

---

## Building the UI

When placing an order we can create a new checkout session to contain all relevant information for completing a
purchase.

On confirmation order, the following snippet can update the `checkout_session` document. This trigger will allow Stripe
to synchronize and produce a checkout url

```ts
async function onPlaceOrder() {
  if (!address) return;
  if (!rate) return;
  checkout.trigger({
    mode: 'payment',
    success_url: `${window.location.origin}/account/orders?completed=true`,
    cancel_url: window.location.href,
    line_items: [
      ...cart.map((item) => ({
        price: item.metadata.price,
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: 'USD',
          unit_amount_decimal: (rate.shippingAmount.amount * 100) | 0,
          product_data: {
            name: 'Shipping',
            description: `Shipping via ${rate.carrierFriendlyName}`,
          },
        },
        quantity: 1,
      },
    ],
    collect_shipping_address: true,
    shipment: {
      ...shipment.current!,
      carrierId: rate.carrierId,
      serviceCode: rate.serviceCode,
    },
  });
}
```

A `useCheckout` hook can be introduced to handle checkout changes for the user, the following snippet demonstrates how
to redirect when a `Stripe` url has been generated.

```js
const unsubscribe = onSnapshot(
  ref,
  snapshot => {
    const data = snapshot.data();

    if (data?.url) {
      unsubscribe?.();
      window.location.assign(data.url);
    }

    if (data?.error) {
      unsubscribe?.();
      setError(new Error(data.error.message));
      setLoading(false);
    }
  },
  e => {
    unsubscribe?.();
    setError(e);
    setLoading(false);
  }
);
```

On a successful redirect Stripe will then redirect to the Stripe Checkout Form

![image](https://user-images.githubusercontent.com/2060661/139295631-ca9b3e3d-b369-4822-b3c7-a7bec36e0af5.png)

---

## Resources

- [Stripe Subscriptions Extension](https://firebase.google.com/products/extensions/firestore-stripe-subscriptions?authuser=0)
- [Stripe Credentials](https://stripe.com/docs/keys)
