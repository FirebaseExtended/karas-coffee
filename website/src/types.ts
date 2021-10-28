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

import { Timestamp } from '@firebase/firestore';

export type ProductType = 'swag' | 'coffee' | 'subscription';

type ProductRecord = {
  id: string;
  active: boolean;
  description: string;
  images: string[];
  name: string;
  role: null;
  tax_code: null;
};

type ProductRecordMetadata = {
  type: ProductType;
  price: string;
  price_usd: string;
  weight: string;
};

export type ProductCoffee = {
  metadata: {
    type: 'coffee';
    origin: string;
    strength: string;
    variety: string;
  } & ProductRecordMetadata;
} & ProductRecord;

export type ProductSwag = {
  metadata: {
    type: 'swag';
  } & ProductRecordMetadata;
} & ProductRecord;

export type ProductSubscription = {
  metadata: {
    type: 'subscription';
  } & ProductRecordMetadata;
} & ProductRecord;

export type Product = ProductCoffee | ProductSwag | ProductSubscription;

export function isProductCoffee(product: Product): product is ProductCoffee {
  return product.metadata.type === 'coffee';
}

export function isProductSwag(product: Product): product is ProductSwag {
  return product.metadata.type === 'swag';
}

export function isProductSubscription(product: Product): product is ProductSubscription {
  return product.metadata.type === 'subscription';
}

export type Review = {
  id: string;
  created_at: Date;
  product_id: string;
  rating: number;
  message: string;
  files?: File[];
  user: {
    id: string;
    display_name: string;
    photo_url?: string;
  };
  attribute_scores: null | {
    IDENTITY_ATTACK: number;
    INSULT: number;
    PROFANITY: number;
    SEVERE_TOXICITY: number;
    THREAT: number;
    TOXICITY: number;
  };
};

export interface Customer {
  id: string;
  stripe_id: string;
}

export interface Session {
  mode: 'payment' | 'subscription';
  success_url: string;
  cancel_url: string;
  customer: string; // Stripe customer id
  line_items?: (
    | {
        price: string;
        quantity: number;
      }
    | {
        price_data: {
          currency: string;
          unit_amount_decimal: number;
          product_data: {
            name: string;
            description?: string;
          };
        };
        quantity: number;
      }
  )[];
  price?: string;
  shipping?: {
    name: string;
    address: {
      country: string;
      line1: string;
      line2?: string;
      city: string;
      postal_code: string;
      state: string;
    };
  };
  shipment?: Shipment;
  collect_shipping_address: boolean;
  // Updated via extension
  url?: string;
  error?: {
    message: string;
  };
}

export interface Subscription {
  id: string;
  status: string;
  [key: string]: unknown;
}

export interface Content {
  id: string;
  title: string;
  hero: string;
  excerpt: string;
  created_at: Timestamp;
  content: string;
}

export interface Address {
  id: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    cityLocality: string;
    name: string;
    stateProvince: string;
    postalCode: string;
    countryCode: string;
  };
  validation?: {
    // https://www.shipengine.com/docs/addresses/validation/#address-status-meanings
    status: 'verified' | 'unverified' | 'warning' | 'error';
  };
}

export interface ShippingRate {
  carrierDeliveryDays: string;
  rateId: string;
  carrierId: string;
  serviceCode: string;
  serviceType: string;
  carrierFriendlyName: string;
  deliveryDays: string;
  shippingAmount: {
    amount: number;
  };
}

export interface Shipment {
  carrierId?: string;
  serviceCode?: string;
  shipDate: string;
  shipFrom: {
    name: string;
    phone: string;
    addressLine1: string;
    cityLocality: string;
    stateProvince: string;
    postalCode: string;
    countryCode: string;
  };
  shipTo: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    cityLocality: string;
    stateProvince: string;
    postalCode: string;
    countryCode: string;
  };
  packages: {
    weight: {
      value: number;
      unit: string;
    };
  }[];
}
