## Coffee Scripts

A collection of scripts and tools to manage this project.

```bash
cd tools
yarn
```

### Importing product data into Stripe

```bash
yarn stripe:import-products
```

Note: this script requires you create a `tools/.env` file with your `STRIPE_SECRET_KEY` set in it.

### Deploy Firestore Rules

```bash
yarn firebase:deploy-firestore-rules
```

### Run Firebase Emulator suite for local development

```bash
yarn firebase:start-emulators
```
