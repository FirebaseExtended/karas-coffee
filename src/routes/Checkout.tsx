import React from 'react';
import { useFormik } from 'formik';

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
import { add, format } from 'date-fns';
import { useAddressValidation } from '../hooks/useAddressValidation';

export function Checkout() {
  const { cart } = useCart();

  return (
    <section className="mt-8 px-4 lg:px-0">
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
            <div className="flex-shrink-0 w-32 lg:w-64">
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

  const checkout = useCheckout();
  const address = useAddressValidation();

  const formik = useFormik<AddressFormValues>({
    initialValues: {
      name: user.data?.displayName || '',
      line1: '1600 Amphitheatre Parkway',
      line2: '',
      city: 'Mountain View',
      state: 'CA',
      postal_code: '94043',
    },
    async onSubmit(values) {
      await address.validate(values);
      await checkout.trigger({
        mode: 'payment',
        success_url: `${window.location.origin}/account/orders?completed=true`,
        cancel_url: window.location.href,
        line_items: cart.map((item) => ({
          price: item.metadata.price,
          quantity: item.quantity,
        })),
        shipping: {
          name: values.name,
          address: {
            country: 'US', // TODO(ehesp): allow users to select country
            line1: values.line1,
            line2: values.line2,
            city: values.city,
            postal_code: values.postal_code,
            state: values.state,
          },
        },
        collect_shipping_address: true,
        shipment: {
          carrierId: 'se-423887',
          serviceCode: 'usps_media_mail',
          shipDate: format(new Date(), 'yyyy-mm-dd'),
          shipFrom: {
            name: "Kara's Coffee",
            phone: '512-343-5283',
            addressLine1: '500 W 2nd St',
            cityLocality: 'Austin',
            stateProvince: 'TX',
            postalCode: '78701',
            countryCode: 'US',
          },
          shipTo: {
            name: values.name,
            addressLine1: values.line1,
            addressLine2: values.line2,
            cityLocality: values.city,
            stateProvince: values.state,
            postalCode: values.postal_code,
            countryCode: 'US',
          },
          packages: [
            {
              weight: {
                value: cart.reduce((total, { metadata, quantity }) => total + parseInt(metadata.weight) * quantity, 0),
                unit: 'gram',
              },
            },
          ],
        },
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="lg:sticky p-8 space-y-4 border rounded bg-gray-50 top-20">
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

      <Button type="submit" className="block" loading={checkout.loading || address.loading} disabled={!formik.isValid}>
        Checkout
      </Button>
      {!!checkout.loading && <div className="mt-4 text-xs">Creating a checkout session...</div>}
      {!!address.loading && <div className="mt-4 text-xs">Validating your address...</div>}
      {!!checkout.error && (
        <div className="mt-4">
          <Error>{checkout.error.message}</Error>
        </div>
      )}
      {!!address.error && (
        <div className="mt-4">
          <Error>{address.error.message}</Error>
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
