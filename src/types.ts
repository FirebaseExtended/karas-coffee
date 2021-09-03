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

export interface Customer {
  id: string;
  checkout_sessions?: Checkout_Sessions;
}

export interface Checkout_Sessions {
  mode?: string;
  price: string;
  success_url: string;
  cancel_url: string;
  sessionId?: string;
}

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
