import React, { useState } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';

import { XIcon } from '@heroicons/react/solid';
import { Button } from '../components/Button';
import { Input, Error } from '../components/Form';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';

import { isProductCoffee } from '../types';
import { ProductCoffeeMetadata } from '../components/ProductCard';
import { Alert } from '../components/Alert';
import { Address, AddressFormValues } from '../components/Address';
import { useUser } from '../hooks/useUser';

export function Checkout() {
  const { cart } = useCart();

  return (
    <section className="mt-8">
      <div className="max-w-3xl mx-auto">
        <Alert type="danger">
          <b>This is a demo application!</b> This is purely for example purposes - do not use real payment information.
        </Alert>
      </div>
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
          <div key={item.id} className="flex py-8 space-x-4">
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

  const { checkout, error, loading } = useCheckout();

  // TODO(ehesp): Add address validation
  const formik = useFormik<AddressFormValues>({
    initialValues: {
      name: user.data?.displayName || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
    },
    async onSubmit(values) {
      await checkout({
        mode: 'payment',
        success_url: `${window.location.origin}/account/orders`,
        cancel_url: window.location.href,
        line_items: cart.map((item) => ({
          price: item.metadata.price,
          quantity: item.quantity,
        })),
        shipping: {
          name: values.name,
          shipDate: moment().format("YYYY-MM-DD"),
          fromAddress: {
            // TODO: set this in env variables or somewhere centralized
            country: 'US',
            line1: '500 W 2nd St',
            city: 'Austin',
            postal_code: '78701',
            state: 'TX',
            name: "Kara's Coffee",
            phone: '512-343-5283'
          },
          address: {
            country: 'US', // TODO(ehesp): allow users to select country
            line1: values.line1,
            line2: values.line2,
            city: values.city,
            postal_code: values.postal_code,
            state: values.state,
          },
          weight: {
            value: cart.reduce((total, { metadata, quantity }) => total + (parseInt(metadata.weight) * quantity), 0),
            unit: 'gram'
          }
        },
        isPaid: false,
        collect_shipping_address: true,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="sticky p-8 space-y-4 border rounded bg-gray-50 top-20">
      <div>
        <h2 className="mb-2 text-lg font-bold text-gray-700">Shipping Address</h2>
        <Address values={formik.values} onChange={formik.handleChange} errors={formik.errors} />
      </div>
      <div>
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
      </div>

      <Button type="submit" className="block" loading={loading} disabled={!formik.isValid}>
        Checkout
      </Button>
      {!!error && (
        <div className="mt-4">
          <Error>{error.message}</Error>
        </div>
      )}
    </form>
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
