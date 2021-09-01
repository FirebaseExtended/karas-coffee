import React from 'react';
import { useCart } from '../hooks/useCart';

export function Checkout() {
  const { cart, clearCart } = useCart();

  return (
    <section>
      <h1>Checkout</h1>
      <hr />
      <div>
        {cart.map((item) => (
          <div key={item.id}>
            <h2>
              {item.name} - {item.quantity}
            </h2>
          </div>
        ))}
      </div>
      {cart.length === 0 && <div>Your cart is empty.</div>}
      <hr />
      <div>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </section>
  );
}
