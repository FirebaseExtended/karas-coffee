import React from 'react';
import { useProducts } from '../hooks/useProducts';

export function Homepage() {
  const products = useProducts('name');
  console.log(products);
  return (
    <>
      <section className="grid grid-cols-4 gap-6">
        {products.status === 'success' &&
          products.data.map((product) => (
            <div key={product.id} className="bg-gray-100 rounded shadow-sm overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="object-cover w-full h-48" />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div>Strength: {product.metadata.strength}</div>
            </div>
          ))}
      </section>
    </>
  );
}
