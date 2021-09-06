export type ProductType = 'swag' | 'coffee';

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

export type Product = ProductCoffee | ProductSwag;

export function isProductCoffee(product: Product): product is ProductCoffee {
  return product.metadata.type === 'coffee';
}

export function isProductSwag(product: Product): product is ProductSwag {
  return product.metadata.type === 'swag';
}

export type Review = {
  id: string;
  created_at: Date;
  product_id: string;
  rating: number;
  message: string;
  user: {
    id: string;
    display_name: string;
    photo_url?: string;
  };
  attribute_scores: {
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
  line_items?: {
    price: string;
    quantity: number;
  }[];
  // Updated via extension
  url?: string;
  error?: {
    message: string;
  };
}
