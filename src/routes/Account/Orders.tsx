import React, { useState } from 'react';
import cx from 'classnames';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { useOrders } from '../../hooks/useOrders';
import { emptyArray } from '../../utils';
import { Skeleton } from '../../components/Skeleton';

type OrderMap = { [key: string]: boolean };

export function Orders() {
  const orders = useOrders();

  const [open, setOpen] = useState<OrderMap>({});

  function toggleOrder(orderId: string) {
    setOpen((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }

  return (
    <section>
      <h1 className="font-bold text-2xl">Your Orders</h1>
      <div className="border rounded mt-6 divide-y">
        {orders.isLoading &&
          emptyArray(5).map((_, i) => (
            <div key={i} className="p-6 flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-2" />
              <div className="flex-grow">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-64 h-3 mt-2" />
              </div>
              <div>
                <Skeleton className="w-16 h-10" />
              </div>
            </div>
          ))}
        {orders.isSuccess &&
          orders.data.map((order, index) => (
            <div key={order.id}>
              <div className="flex items-center space-x-4 p-6">
                <button onClick={() => toggleOrder(order.id)} className="p-2">
                  <ChevronRightIcon
                    className={cx('w-5 h-5 transform transition-transform', {
                      'rotate-90': !!open[order.id],
                    })}
                  />
                </button>
                <div className="flex-grow">
                  <div className="font-bold">Friday 2nd July</div>
                  {!!order.shipping && (
                    <div className="text-sm text-gray-600">
                      {[
                        order.shipping.name,
                        order.shipping.address.line1,
                        order.shipping.address.line2,
                        order.shipping.address.city,
                        order.shipping.address.state,
                        order.shipping.address.city,
                        order.shipping.address.postal_code,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg">${(order.amount / 100).toFixed(2)}</div>
                </div>
              </div>
              {!!open[order.id] && (
                <div className="bg-gray-50 p-6">
                  <div className="flex pb-3">
                    <div className="flex-grow">
                      {!!order.charges?.data?.[0].receipt_url && (
                        <a
                          href={order.charges.data[0].receipt_url}
                          target="_blank"
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          View Receipt &rarr;
                        </a>
                      )}
                    </div>
                    <div className="font-medium">Sub Total</div>
                  </div>
                  <div className="divide-y">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center py-3">
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg">{item.description}</h3>
                          <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        </div>
                        <div className="flex justify-end">
                          <div className="font-medium">${(item.amount_subtotal / 100).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex py-3 font-bold">
                      <div className="flex-grow">Total</div>
                      <div>${(order.amount / 100).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
