import React, { createContext, useContext } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';

import { useUser } from '../hooks/useUser';
import { Product } from '../types';
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

export type CartItem = Product & { quantity: number };

export type CardContextProps = {
  cart: CartItem[];
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  setQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  getItem: (product: Product) => CartItem | undefined;
};

export const CartContext = createContext<CardContextProps>({
  cart: [],
  total: 0,
  addToCart() {},
  setQuantity() {},
  removeFromCart() {},
  clearCart() {},
  getItem() {
    return undefined;
  },
});

type CartProviderProps = {
  children: React.ReactElement;
};

export function CartProvider(props: CartProviderProps) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  return (
    <CartContext.Provider
      value={{
        cart,
        total: cart.reduce((total, item) => total + parseInt(item.metadata.price_usd) * item.quantity, 0),
        addToCart(product, quantity = 1) {
          setCart([...cart, { ...product, quantity }]);
        },
        setQuantity(product, quantity) {
          const _clone = [...cart];
          const index = _clone.findIndex((item) => item.id === product.id);

          if (index > -1) {
            _clone[index].quantity = quantity;
            setCart(_clone);
          }
        },
        removeFromCart(product) {
          setCart(cart.filter((p) => p.id !== product.id));
        },
        clearCart() {
          setCart([]);
        },
        getItem(product) {
          return cart.find((p) => p.id === product.id);
        },
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
