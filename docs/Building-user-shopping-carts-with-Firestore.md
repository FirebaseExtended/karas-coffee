The Extensions Demo application allows us to add products to a shopping cart, which are persisted.

Before a user can add an item, they must be authenticated. By being an authenticated user we have access to their unique
User ID thanks to Firebase Authentication. When a user adds a product to the cart, we create an object containing the
entire product document from our `products` collection, along with a `quantity` field.

Within our Firestore collection `cart`, each user has a unique document using their user ID as the document ID (`cart/{uid}`).
Within each document, the cart items are stored as an array within the `items` field:

![image](https://user-images.githubusercontent.com/2060661/139304047-22c82faf-d2c5-44a2-bf52-7a1f9abaf913.png)

Each item within the array is an map with a unique product (by product `id`).

As products are added or removed from the cart, we're able to create a new array of data to be stored within our
document:

```js
function addToCart(product, quantity = 1) {
  return [...cartItems, {...product, quantity}];
}

function removeFromCart(product) {
  return cartItems.filter(p => p.id !== product.id);
}
```

If users wish to increase/decrease the quantity of an existing cart item, we can mutate the existing Array:

```js
function setQuantity(product, quantity) {
  const items = [...cartItems];
  const index = items.findIndex(item => item.id === product.id);

  if (index > -1) {
    items[index].quantity = quantity;
  }

  return items;
}
```

Each time the cart changes, a Firestore `set` operation is carried out to sync the new Array of items to a Firestore document.

---

## Send abandoned cart reminders with SendGrid

The [Send abandoned cart reminders with SendGrid](https://github.com/twilio-labs/twilio-firebase-extensions/tree/main/abandoned-cart-emails)
Extension enables us to send emails to users who have a stale shopping cart, prompting them to hopefully come back and complete their checkout.

### Configuration

In order to set up the abandoned cart extension, a `collection` will need to be defined for email documents.

Additionally, a [SendGrid API key](https://app.sendgrid.com/settings/api_keys) is required.

---

### Creating a template

To create a custom template, a new `dynamic template` must be created through the
SendGrid [Email API Dashboard](https://mc.sendgrid.com/dynamic-templates)

When creating a template through the visual editor, products can be listed using [Handlebars](https://handlebarsjs.com/)
syntax to iterate through and display data provided by the `dynamicTemplateData` field of the cart email:

```js
{
  dynamicTemplateData: {
    items: [{...item}];
  }
}
```

---

## Resources

- [`useCart`](https://github.com/FirebaseExtended/karas-coffee/blob/main/website/src/hooks/useCart.ts) hook used on the
  application.
- [SendGrid](https://sendgrid.com/)
- [Send Abandoned Cart reminders with SendGrid](https://github.com/twilio-labs/twilio-firebase-extensions/tree/main/abandoned-cart-emails)
