import { format } from 'date-fns';
import { FormikErrors, useFormik } from 'formik';
import React, { useState } from 'react';
import { Address, AddressFormValues } from '../../components/Address';
import { Button } from '../../components/Button';
import { OrderSummary } from '../../components/OrderSummary';
import { useAddressValidation } from '../../hooks/useAddressValidation';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import { useRatesCalculation } from '../../hooks/useRatesCalculation';

export function Shipping() {
  const { cart } = useCart();
  const checkout = useCheckout();

  const [provider, setProvider] = useState<any>();
  const [shipping, setShipping] = useState<any>();

  async function onPlaceOrder() {
    await checkout.trigger({
      mode: 'payment',
      success_url: `${window.location.origin}/account/orders?completed=true`,
      cancel_url: window.location.href,
      line_items: [
        ...cart.map((item) => ({
          price: item.metadata.price,
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: 'USD',
            unit_amount_decimal: provider.shippingAmount.amount * 100,
            product_data: {
              name: 'Shipping',
            },
          },
          quantity: 1,
        },
      ],
      collect_shipping_address: true,
      shipment: {
        ...shipping,
        carrierId: provider.carrierId,
        serviceCode: provider.serviceCode,
      },
    });
  }

  return (
    <section className="mt-8 px-4 lg:px-0">
      <div className="max-w-3xl mx-auto"></div>
      <h1 className="mt-8 mb-8 text-4xl font-extrabold tracking-wide">Shipping</h1>
      <p>Please enter or select an address to calculate shipping rates.</p>
      {cart.length === 0 && (
        <>
          <div className="flex items-center justify-center h-64 text-gray-600">Your cart is currently empty.</div>
        </>
      )}
      {cart.length > 0 && (
        <div className="lg:grid grid-cols-12 gap-16">
          <div className="col-start-1 col-end-8 mt-4">
            <div>
              <div className="bg-gray-50 p-6 rounded border">
                <RatesSelection
                  onShippingCost={(provider, shipment) => {
                    setProvider(provider);
                    setShipping(shipment);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-start-8 col-end-13">
            <OrderSummary
              shippingCost={provider?.shippingAmount.amount}
              shipping={
                <>
                  {!provider && <span>Pending</span>}
                  {!!provider && <span>${provider.shippingAmount.amount}</span>}
                </>
              }
            />
            <Button disabled={!provider} loading={checkout.loading} onClick={onPlaceOrder}>
              Place Order &rarr;
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function RatesSelection({ onShippingCost }: { onShippingCost: (provider: any, shipment: any) => void }) {
  const [error, setError] = useState<string | null>(null);
  const validation = useAddressValidation();
  const rates = useRatesCalculation();
  const [providers, setProviders] = useState<any>();

  function addressToShipment(address: AddressFormValues) {
    return {
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
        name: address.name,
        addressLine1: address.line1,
        addressLine2: address.line2,
        cityLocality: address.city,
        stateProvince: address.state,
        postalCode: address.postal_code,
        countryCode: 'US',
      },
      packages: [
        {
          weight: {
            value: 30,
            unit: 'gram',
          },
        },
      ],
    };
  }

  const formik = useFormik<AddressFormValues>({
    initialValues: {
      name: '',
      line1: '1600 Amphitheatre Parkway',
      line2: '',
      city: 'Mountain View',
      state: 'CA',
      postal_code: '94043',
    },
    validate(values) {
      const e: FormikErrors<AddressFormValues> = {};
      if (!values.name) e.name = 'A name is required';
      return e;
    },
    async onSubmit(values) {
      const valid = await validation.mutateAsync({
        address: {
          name: "Kara's Coffee",
          phone: '512-343-5283',
          addressLine1: '500 W 2nd St',
          cityLocality: 'Austin',
          stateProvince: 'TX',
          postalCode: '78701',
          countryCode: 'US',
        },
      });
      const status = valid.validation.status;

      if (status === 'verified' || status === 'warning') {
        const results = await rates.mutateAsync({
          rateOptions: {
            carrierIds: ['se-765964', 'se-765965', 'se-765963'],
            serviceCodes: ['usps_media_mail'],
          },
          shipment: addressToShipment(values),
        });

        setProviders(results.rates);
      } else {
        setError('The provided address is not valid.');
      }
    },
  });

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Enter a shipping address</h3>
      <Address values={formik.values} onChange={formik.handleChange} errors={formik.errors} />
      <div className="mt-4">
        <Button
          loading={validation.isLoading || rates.isLoading}
          disabled={!formik.isValid}
          onClick={formik.submitForm}
        >
          Calculate Shipping &rarr;
        </Button>
      </div>
      {!!error && <div className="mt-4 text-red-600 text-xs">{error}</div>}
      {!!validation.error && <div className="mt-4 text-red-600 text-xs">{validation.error.message}</div>}
      {!!rates.error && <div className="mt-4 text-red-600 text-xs">{rates.error.message}</div>}
      {providers && (
        <div className="mt-4">
          <h3 className="mb-2 text-xl font-bold">Select a shipping provider</h3>
          <div className="divide-y">
            {providers.length === 0 && (
              <div>Sorry, no carriers are available for your address. Please try a different address.</div>
            )}
            {!!providers.length &&
              providers.map((provider: any) => (
                <div
                  className="flex items-center py-1 px-4 hover:bg-gray-100"
                  role="button"
                  onClick={() => onShippingCost(provider, addressToShipment(formik.values))}
                >
                  <div className="flex-grow">
                    <div className="font-medium">{provider.carrierFriendlyName}</div>
                    <p className="text-xs text-gray-600">Delivers in {provider.deliveryDays} days.</p>
                  </div>
                  <div>${provider.shippingAmount.amount}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
