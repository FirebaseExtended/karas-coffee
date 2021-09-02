import { XIcon } from '@heroicons/react/solid';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { Input } from '../components/Form';
import { Gallery } from '../components/Gallery';

import { useCart } from '../hooks/useCart';
import { useProduct } from '../hooks/useProduct';

export function Product() {
  const { id } = useParams();
  const product = useProduct(id);
  const { addToCart, removeFromCart, getItem, setQuantity } = useCart();

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
          <div className="mt-6">
            {!!cartItem && (
              <div className="mt-4 flex items-center">
                <div className="flex-grow">
                  <Input
                    id={`quantity-${product.data.id}`}
                    type="number"
                    label="Quantity"
                    value={cartItem.quantity}
                    max="100"
                    min="1"
                    onChange={(e) => {
                      let quantity = parseInt(e.target.value);
                      if (isNaN(quantity) || quantity < 1) quantity = 1;
                      if (quantity > 100) quantity = 100;
                      setQuantity(product.data, quantity);
                    }}
                  />
                </div>
                <div className="w-10 flex-shrink-0 flex items-center justify-center">
                  <XIcon
                    role="button"
                    className="w-5 h-5 mt-7 hover:opacity-50"
                    onClick={() => removeFromCart(product.data)}
                  />
                </div>
              </div>
            )}
            {!cartItem && (
              <Button onClick={() => addToCart(product.data)}>
                Add to cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
