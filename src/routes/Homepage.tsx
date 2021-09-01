import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

export function Homepage() {
  const products = useProducts('name');

  return (
    <>
      <div>
        <div>
          
        </div>
        <section className="grid grid-cols-4 gap-x-6 gap-y-12">
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
        </section>
      </div>
    </>
  );
}
