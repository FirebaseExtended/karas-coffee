/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { products } from './data/products';
import { stripe } from './stripe';

async function main() {
  console.log(`Found ${products.length} products locally...`);
  products.forEach((product) => console.log(` - ${product.name}`));
  console.log('');

  for (const product of products) {
    const { price_usd, ...stripeObject } = product;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stripeObject.metadata = { ...product.metadata, price_usd: '' + product.price_usd } as any;

    let productExists = false;
    try {
      await stripe.products.retrieve(product.id);
      productExists = true;
    } catch {}

    if (!productExists) {
      await stripe.products.create(stripeObject);
      console.log(`Created product '${product.name}' on Stripe`);
    } else {
      console.log(
        `Product '${product.name}' already exists, updating name, image, metadata & description fields only.`,
      );
      await stripe.products.update(product.id, {
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: stripeObject.metadata,
      });
    }

    const { data: prices } = await stripe.prices.list({ product: product.id, active: true });
    const priceExists = prices.length > 0;
    let recurring = {};
    if (product.metadata.type == 'subscription') {
      recurring = {
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      };
    }
    if (!priceExists) {
      const price = await stripe.prices.create({
        currency: 'usd',
        product: product.id,
        unit_amount: price_usd * 100,
        metadata: {
          ...stripeObject.metadata,
          product_id: product.id,
        },
        ...recurring,
      });
      // Add price id to product metadata - helps us do less firestore requests.
      await stripe.products.update(product.id, {
        metadata: { ...stripeObject.metadata, price: price.id },
      });
      console.log(`Created price '${price.id}' for product '${product.id}' on Stripe`);
    } else {
      console.log(
        `Price '${prices[0].id}' for product '${product.id}' already exists, if you want to update it, delete the price first.`,
      );
    }
  }
}

main().catch((error) => {
  console.error('An error occurred when importing products into Stripe:');
  console.error(error);
  process.exit(1);
});
