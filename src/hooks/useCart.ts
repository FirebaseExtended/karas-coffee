import { doc, setDoc } from 'firebase/firestore';
import { useMutation, useQueryClient } from 'react-query';

import { collections } from '../firebase';
import { Product } from '../types';
import { useFirestoreDocument, useFirestoreDocumentKey } from './useFirestore';
import { useUser } from './useUser';

export type CartItem = Product & { quantity: number };

type UseCart = {
  cart: CartItem[];
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  setQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  getItem: (product: Product) => CartItem | undefined;
};

export function useCart(): UseCart {
  const client = useQueryClient();
  const user = useUser();
  const ref = doc(collections.cart, user.data?.uid ?? '-');

  const queryKeyName = 'cart';
  const queryKey = useFirestoreDocumentKey(queryKeyName);
  const cart = useFirestoreDocument(queryKeyName, ref);

  const cartItems = (!user ? [] : cart.data?.items ?? []) as CartItem[];

  const mutation = useMutation<void, Error, CartItem[]>(
    async (items) => {
      await setDoc(ref, { items }, { merge: true });
    },
    {
      onSuccess() {
        client.invalidateQueries(queryKey);
      },
    },
  );

  return {
    cart: cartItems,
    total: cartItems.length,
    addToCart(product, quantity = 1) {
      mutation.mutate([...cartItems, { ...product, quantity }]);
    },
    setQuantity(product, quantity) {
      const items = [...cartItems];
      const index = items.findIndex((item) => item.id === product.id);

      if (index > -1) {
        items[index].quantity = quantity;
      }

      mutation.mutate(items);
    },
    removeFromCart(product) {
      mutation.mutate(cartItems.filter((p) => p.id !== product.id));
    },
    clearCart() {
      mutation.mutate([]);
    },
    getItem(product) {
      return cartItems.find((p) => p.id === product.id);
    },
  };
}
