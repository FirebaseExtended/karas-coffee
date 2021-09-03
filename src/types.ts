export interface Product {
  id: string;
  active: boolean;
  description: string;
  images: string[];
  metadata: {
    price: string;
    price_usd: string;
    origin: string;
    strength: string;
    variety: string;
  };
  name: string;
  role: null;
  tax_code: null;
}

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
