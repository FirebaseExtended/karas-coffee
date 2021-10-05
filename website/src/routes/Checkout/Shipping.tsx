import { format } from 'date-fns';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { AddressBook } from '../../components/AddressBook';
import { Button } from '../../components/Button';
import { OrderSummary } from '../../components/OrderSummary';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';
import { useRatesCalculation } from '../../hooks/useRatesCalculation';
import { ShippingRate, Address, Shipment } from '../../types';
import { emptyArray } from '../../utils';
import { Skeleton } from '../../components/Skeleton';

export function Shipping() {
  const { cart } = useCart();
  const checkout = useCheckout();

  const [address, setAddress] = useState<Address | null>(null);
  const [rate, setRate] = useState<ShippingRate | null>(null);
  const shipment = useRef<Shipment>();

  async function onPlaceOrder() {
    if (!address) return;
    if (!rate) return;
    checkout.trigger({
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
            unit_amount_decimal: (rate.shippingAmount.amount * 100) | 0,
            product_data: {
              name: 'Shipping',
              description: `Shipping via ${rate.carrierFriendlyName}`,
            },
          },
          quantity: 1,
        },
      ],
      collect_shipping_address: true,
      shipment: {
        ...shipment.current!,
        carrierId: rate.carrierId,
        serviceCode: rate.serviceCode,
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
            <AddressBook
              onSelect={(address) => {
                setAddress(address);
              }}
            />
          </div>
          <div className="col-start-8 col-end-13 space-y-4">
            <ShippingRates
              address={address}
              onSelect={(rate, shipping) => {
                setRate(rate);
                shipment.current = shipping;
              }}
            />
            <OrderSummary
              shippingCost={rate?.shippingAmount.amount}
              shippingLabel={rate?.carrierFriendlyName ? `Shipping via ${rate.carrierFriendlyName}` : undefined}
              shipping={
                <>
                  {!rate && <span>TBC</span>}
                  {!!rate && <span>${rate.shippingAmount.amount}</span>}
                </>
              }
            />
            <Button disabled={!rate} loading={checkout.loading} onClick={onPlaceOrder}>
              Place Order &rarr;
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function ShippingRates({
  address,
  onSelect,
}: {
  address: Address | null;
  onSelect: (rate: ShippingRate, shipment: Shipment) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const shipment = useRef<Shipment>();

  const rates = useRatesCalculation();
  const id = address?.id;

  useEffect(() => {
    if (!id) return;
    shipment.current = {
      shipDate: format(new Date(), 'yyyy-MM-dd'),
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
        name: address.address.name,
        addressLine1: address.address.addressLine1,
        addressLine2: address.address.addressLine2,
        cityLocality: address.address.cityLocality,
        stateProvince: address.address.stateProvince,
        postalCode: address.address.postalCode,
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

    rates.mutate({
      rateOptions: {
        carrierIds: ['se-765964', 'se-765965', 'se-765963'],
        serviceCodes: ['usps_media_mail'],
      },
      shipment: shipment.current,
    });
  }, [id]);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-700">Shipping Rates</h2>
      {!address && <p className="mt-4 text-sm text-gray-500">Select an address to calculate shipping rates.</p>}
      {rates.isLoading && (
        <div className="mt-2 space-y-3">
          {emptyArray(5).map((_, i) => (
            <div key={i} className="flex h-8">
              <div className="flex-grow">
                <Skeleton className="w-36 h-8" />
              </div>
              <Skeleton className="w-12 h-8" />
            </div>
          ))}
        </div>
      )}
      {!!address && rates.isSuccess && (
        <div>
          <div className="mt-2">
            <p>Select a shipping carrier and rate:</p>
            <div className="mt-2 text-sm text-gray-500">
              {[
                address.address.name,
                address.address.addressLine1,
                address.address.addressLine2,
                address.address.cityLocality,
                address.address.stateProvince,
                address.address.postalCode,
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
          </div>
          <div className="mt-2 max-h-[200px] overflow-y-auto">
            {rates.data.rates.map((rate) => (
              <div
                className={cx('flex items-center py-1 px-1', {
                  'hover:bg-gray-100': rate.rateId !== selected,
                  'bg-green-100': rate.rateId === selected,
                })}
                role="button"
                key={rate.rateId}
                onClick={() => {
                  onSelect(rate, shipment.current!);
                  setSelected(rate.rateId);
                }}
              >
                <div className="flex-grow">
                  <div className="font-medium">{rate.serviceType}</div>
                  <p className="text-xs text-gray-600">
                    {rate.carrierDeliveryDays.length > 1
                      ? rate.carrierDeliveryDays
                      : `Within ${rate.carrierDeliveryDays} day(s).`}
                  </p>
                </div>
                <div>${rate.shippingAmount.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {rates.isError && <p className="mt-4 text-red-500 text-sm">{rates.error.message}</p>}
    </div>
  );
}
