export interface Product {
  id: string;
  slug: string;
  active: boolean;
  description: string;
  images: string[];
  metadata: {
    origin: string;
    strength: string;
    variety: string;
  };
  name: string;
  role: null;
  tax_code: null;
}