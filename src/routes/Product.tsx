import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Gallery } from '../components/Gallery';
import { useCart } from '../hooks/useCart';

import { useProduct } from '../hooks/useProduct';

export function Product() {
  const { id } = useParams();
  const product = useProduct(id);
  const { addToCart, removeFromCart, getItem } = useCart();

  if (product.status === 'loading') {
    return <div />;
  }

  if (product.status === 'error' || !product.data) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-600">
        Sorry, something went wrong loading this product.
      </div>
    );
  }

  if (!product.data) {
    return <div>Not Found</div>;
  }

  const cartItem = getItem(product.data);

  return (
    <section className="">
      <div className="grid grid-cols-2 gap-12">
        <div>
          <Gallery images={product.data.images} />
        </div>
        <div>
          <Link to="/" className="block mb-4 text-sm text-gray-600 hover:underline">
            &laquo; Back to products
          </Link>
          <h1 className="mb-2 text-4xl font-extrabold tracking-wide">{product.data.name}</h1>
          <div className="text-3xl text-gray-600">${product.data.metadata.price_usd}</div>
          <p className="mt-6 text-gray-600">{product.data.description}</p>
          <div>
            {!cartItem && <button onClick={() => addToCart(product.data)}>Add to cart</button>}
            {!!cartItem && <button onClick={() => removeFromCart(product.data)}>Remove from cart</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
