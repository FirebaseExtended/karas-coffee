import React from 'react';
import { useCart } from '../hooks/useCart';

type OrderSummaryProps = {
  shipping: React.ReactNode;
  shippingCost?: number | null;
};

export function OrderSummary({ shipping, shippingCost }: OrderSummaryProps) {
  const { cart, total } = useCart();

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-700">Order Summary</h2>
      <div className="my-4 divide-y">
        {cart.map((item) => (
          <OrderRow
            label={`${item.name} (x${item.quantity})`}
            value={`$${item.quantity * parseInt(item.metadata.price_usd)}`}
          />
        ))}
        <OrderRow label="Tax" value="$0" />
        <OrderRow label="Shipping" value={shipping} />
        <OrderRow
          label={<span className="text-lg font-bold text-gray-900">Order Total</span>}
          value={<span className="text-lg">${total + (shippingCost || 0)}</span>}
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
      <div className="flex-grow text-sm text-gray-600">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
