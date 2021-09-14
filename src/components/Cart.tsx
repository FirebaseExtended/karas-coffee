import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

import { useUser } from '../hooks/useUser';
import { useCart } from '../hooks/useCart';

export function Cart() {
  const user = useUser();
  const { cart } = useCart();

  // Require the user to sign-in to go to the checkout.
  const href = user ? '/checkout' : '/signin?redirect=/checkout';

  return (
    <Link to={href} className="group relative w-10 h-10 flex items-center justify-center">
      <ShoppingCartIcon className="w-6 h-6 text-gray-600 transition-opacity group-hover:opacity-50" />
      {cart.length > 0 && (
        <span className="absolute text-xs font-medium bottom-0 left-0 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-300">
          {cart.length}
        </span>
      )}
    </Link>
  );
}
