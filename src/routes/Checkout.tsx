import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Button } from '../components/Button';
import { Input } from '../components/Form';
import { useCart } from '../hooks/useCart';
import { isProductCoffee } from '../types';
import { ProductCoffeeMetadata } from '../components/ProductCard';
import { Alert } from '../components/Alert';

export function Checkout() {
  const { cart } = useCart();

  return (
    <section className="mt-8">
      <div className="max-w-3xl mx-auto">
        <Alert type="danger">
          <b>This is a demo application!</b> This is purely for example purposes - do not use real payment information.
        </Alert>
      </div>
      <h1 className="mt-8 text-4xl font-extrabold tracking-wide mb-8">Checkout</h1>
      {cart.length === 0 && (
        <>
          <div className="h-64 flex items-center justify-center text-gray-600">Your cart is currently empty.</div>
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
          <div className="flex space-x-4 py-8">
            <div className="w-64 flex-shrink-0">
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
              <div className="mt-4 flex items-center">
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
                <div className="w-10 flex-shrink-0 flex items-center justify-center">
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
  const { total } = useCart();

  return (
    <div className="bg-gray-50 rounded border p-8 sticky top-20">
      <h2 className="text-lg font-bold text-gray-700">Order Summary</h2>
      <div className="divide-y my-4">
        <OrderRow label="Subtotal" value={`$${total}`} />
        <OrderRow label="Shipping" value="$0" />
        <OrderRow label="Tax" value="$0" />
        <OrderRow
          label={<span className="text-lg font-bold text-gray-900">Order Total</span>}
          value={<span className="text-lg">${total}</span>}
        />
      </div>
      <Button className="block">Checkout</Button>
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
      <div className="flex-grow text-gray-600 text-sm">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
