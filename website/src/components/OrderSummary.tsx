import React from 'react';
import { useCart } from '../hooks/useCart';

type OrderSummaryProps = {
  shipping: React.ReactNode;
  shippingLabel?: string;
  shippingCost?: number | null;
};

export function OrderSummary({ shipping, shippingLabel, shippingCost }: OrderSummaryProps) {
  const { cart, total } = useCart();

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
      <div className="my-4 divide-y">
        {cart.map((item) => (
          <OrderRow
            key={item.id}
            label={`${item.quantity} x ${item.name}`}
            value={`$${item.quantity * parseInt(item.metadata.price_usd)}`}
          />
        ))}
        <OrderRow label="Tax" value="$0" />
        <OrderRow label={shippingLabel || 'Shipping'} value={shipping} />
        <OrderRow
          label={<span className="text-lg font-bold text-gray-800">Order Total</span>}
          value={<span className="text-lg">${(total + (shippingCost || 0)).toFixed(2)}</span>}
        />
      </div>
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
      <div className="flex-grow text-sm text-gray-700">{label}</div>
      <div className="text-sm font-bold text-gray-700">{value}</div>
    </div>
  );
}
