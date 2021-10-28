/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import { XIcon } from '@heroicons/react/solid';
import { Button } from '../../components/Button';
import { Input } from '../../components/Form';
import { useCart } from '../../hooks/useCart';

import { isProductCoffee } from '../../types';
import { ProductCoffeeMetadata } from '../../components/ProductCard';
import { Alert } from '../../components/Alert';
import { useNavigate } from 'react-router';
import { OrderSummary } from '../../components/OrderSummary';

export function Checkout() {
  const { cart } = useCart();

  return (
    <section className="mt-8 px-4 lg:px-0">
      <div className="max-w-3xl mx-auto">
        <Alert type="danger">
          <b>This is a demo application!</b> This is purely for example purposes - do not use real payment information.
        </Alert>
      </div>
      <h1 className="mt-8 mb-8 text-4xl font-extrabold tracking-wide text-gray-800">Checkout</h1>
      {cart.length === 0 && (
        <>
          <div className="flex items-center justify-center h-64 text-gray-600">Your cart is currently empty.</div>
        </>
      )}
      {cart.length > 0 && (
        <div className="lg:grid grid-cols-12 gap-16">
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
          <div key={item.id} className="flex py-8 space-x-4">
            <div className="rounded shadow overflow-hidden">
              <img src={item.images[0]} alt={item.name} className="object-cover w-48 h-48" />
            </div>
            <div className="flex-grow py-1">
              <div className="text-lg font-bold text-gray-800">{item.name}</div>
              <div className="text-sm font-bold text-gray-800">${item.metadata.price_usd}</div>
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
                  <XIcon
                    role="button"
                    className="w-5 h-5 mt-7 hover:opacity-50 text-red-400"
                    onClick={() => removeFromCart(item)}
                  />
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
  const navigate = useNavigate();

  return (
    <div className="lg:sticky p-8 space-y-4 border rounded bg-gray-50 top-20">
      <OrderSummary shipping={<span>TBC</span>} />
      <Button onClick={() => navigate('/checkout/shipping')}>Shipping &rarr;</Button>
    </div>
  );
}
