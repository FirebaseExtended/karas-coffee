import React from 'react';
import { useOrders } from '../../hooks/useOrders';

export function Orders() {
  const orders = useOrders();
  console.log(orders);
  return <div>Orders</div>;
}
