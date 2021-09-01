import { useContext } from 'react';
import { CardContextProps, CartContext } from '../components/Cart';

export function useCart(): CardContextProps {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used as a child element of CartProvider.');
  }

  return context;
}
