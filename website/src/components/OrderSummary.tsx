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
