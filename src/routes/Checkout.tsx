import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Button } from '../components/Button';
import { Input } from '../components/Form';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';

import { useCheckout } from '../hooks/useCheckout';
import { isProductCoffee } from '../types';
import { ProductCoffeeMetadata } from '../components/ProductCard';
import Stripe from '../../scripts/stripe';

export function Checkout() {
  const { cart } = useCart();

  return (
    <section>
      <h1 className="mt-8 mb-8 text-4xl font-extrabold tracking-wide">Checkout</h1>
      {cart.length === 0 && (
        <>
          <div className="flex items-center justify-center h-64 text-gray-600">Your cart is currently empty.</div>
        </>
      )}
      {cart.length > 0 && (
        <div className="grid grid-cols-12 gap-16">
          <div className="col-start-1 col-end-8">
            <Items />
          </div>
          <div className="col-start-8 col-end-13">
            <Order />
          </div>
        </div>
      )}
    </section>
  );
}

function Items() {
  const { cart, setQuantity, removeFromCart } = useCart();

  return (
    <section>
      <div className="divide-y">
        {cart.map((item) => (
          <div className="flex py-8 space-x-4">
            <div className="flex-shrink-0 w-64">
              <img src={item.images[0]} alt={item.name} className="rounded shadow" />
            </div>
            <div className="flex-grow py-1">
              <div className="text-lg font-bold tracking-wide text-gray-600">{item.name}</div>
              <div className="font-bold">${item.metadata.price_usd}</div>
              {isProductCoffee(item) && (
                <div className="mt-4">
                  <ProductCoffeeMetadata product={item} />
                </div>
              )}
              <div className="flex items-center mt-4">
                <div className="flex-grow">
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    label="Quantity"
                    value={item.quantity}
                    max="100"
                    min="1"
                    onChange={(e) => {
                      let quantity = parseInt(e.target.value);
                      if (isNaN(quantity) || quantity < 1) quantity = 1;
                      if (quantity > 100) quantity = 100;
                      setQuantity(item, quantity);
                    }}
                  />
                </div>
                <div className="flex items-center justify-center flex-shrink-0 w-10">
                  <XIcon role="button" className="w-5 h-5 mt-7 hover:opacity-50" onClick={() => removeFromCart(item)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Order() {
  const user = useUser();
  const { cart, total } = useCart();
  const sessionID = (Math.random() + 1).toString(36).substring(7);
  const checkout = useCheckout(user?.uid, sessionID, {
    mode: 'payment',
    price: cart[0].metadata.price as string,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  // When we have the sessionId
  //stripe.redirectToCheckout({ sessionId });

  return (
    <div className="sticky p-8 border rounded bg-gray-50 top-20">
      <h2 className="text-lg font-bold text-gray-700">Order Summary</h2>
      <div className="my-4 divide-y">
        <OrderRow label="Subtotal" value={`$${total}`} />
        <OrderRow label="Shipping" value="$0" />
        <OrderRow label="Tax" value="$0" />
        <OrderRow
          label={<span className="text-lg font-bold text-gray-900">Order Total</span>}
          value={<span className="text-lg">${total}</span>}
        />
      </div>
      <Button className="block" onClick={() => checkout()}>
        Checkout
      </Button>
    </div>
  );
}

type OrderRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

function OrderRow({ label, value }: OrderRowProps) {
  return (
    <div className="flex items-center py-2">
      <div className="flex-grow text-sm text-gray-600">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
