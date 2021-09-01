import React from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';

export function Product() {
  const { id } = useParams();
  const product = useProduct(id);

  if (product.status === 'error') {
    return <div>Error...</div>;
  }

  if (product.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!product.data) {
    return <div>Not Found</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-12">
      <div>
        <img src={product.data.images[0]} alt={product.data.name} className="rounded" />
      </div>
      <div>
        <h1 className="mb-2 text-4xl font-extrabold tracking-wide">{product.data.name}</h1>
        <div className="text-3xl text-gray-600">$10</div>
        <p className="mt-6 text-gray-600">{product.data.description}</p>
      </div>
    </div>
  );
}
