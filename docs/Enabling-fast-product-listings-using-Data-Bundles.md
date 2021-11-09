The `Firestore-Bundle-Server` extension is used to cache product data for faster loading on the website.

## Configuration

This configuration is built on settings added to a `bundles` collection.

Example Query for product bundle:

```js
const config = {
  clientCache: "3200",
  queries: {
    products: {
      collection: "products",
      conditions: [{
        where: [
          "stripe_metadata_type",
          "!=",
          "subscription"
        ]
      },
        [{
          "orderBy": [
            "stripe_metadata_type",
            "asc"
          ]
        }],
        [{
          "orderBy": ["name", "asc"]
        }]
      ],
    }
  }
}
```

In addition, using `Firebase hosting`. The bundle server can be specified in the projects `firebase.json` configuration

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/bundles/*",
        "function": "ext-firestore-bundle-server-serve"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Resources

- [Firebase Hosting](https://firebase.google.com/docs/hosting)
