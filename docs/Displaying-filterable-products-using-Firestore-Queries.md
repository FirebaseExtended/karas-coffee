## Configuring

See [Syncing Stripe Products](./Syncing-products-using-the-Stripe-Extension.md) for importing Stripe products.

## Building the UI

Once products are synchronized in Firebase, these can be queried and display through a Firestore query.

For example:

```ts
export function useProducts(
  key: QueryKey,
  constraintsOrNamedQuery?: QueryConstraint[] | string
): UseQueryResult<Product[]> {
  const collection = collections.products;
  let ref: Query<Product> | NamedQuery<Product>;

  if (constraintsOrNamedQuery) {
    if (isQueryConstraints(constraintsOrNamedQuery)) {
      ref = query(collection, ...constraintsOrNamedQuery);
    } else {
      ref = namedQuery(firestore, constraintsOrNamedQuery);
    }
  } else {
    ref = query(collection);
  }

  return (
    useFirestoreQueryData<Product>
    (key,
      ref,
      {
        subscribe: true,
      })
  );
}
```

and then queried with

```ts
const products = useProducts(['homepage', 'type'], [limit(4), where('metadata.type', '==', type)]);
```

![image](https://user-images.githubusercontent.com/2060661/139276685-ec1b0a2d-f80a-4e64-9674-d97041046efb.png)

---

## Resources

- [Firebase Cloud Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
