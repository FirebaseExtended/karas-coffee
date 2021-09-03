import { FirestoreDataConverter } from 'firebase/firestore';
import { Product, Customer, Checkout_Sessions } from '../types';

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot): Product {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      name: data.name || '',
      role: data.role,
      tax_code: data.tax_code,
      active: !!data.active,
      description: data.description || '',
      images: data.images || [],
      metadata: {
        type: data.metadata?.type ?? '',
        price: data.metadata?.price ?? '',
        price_usd: data.metadata?.price_usd ?? '',
      },
    };
  },
  toFirestore() {
    throw new Error('Client does not support updating products.');
  },
};

export const customerConverter: FirestoreDataConverter<Customer> = {
  fromFirestore(snapshot): Customer {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      checkout_sessions: data.checkout_sessions,
    };
  },
  toFirestore(snapshot): Customer {
    console.log('Snappy >>>>>', snapshot);
    return snapshot as Customer;
  },
};

export const checkoutSessionsConverter: FirestoreDataConverter<Checkout_Sessions> = {
  fromFirestore(snapshot): Checkout_Sessions {
    const data = snapshot.data();

    return {
      sessionId: data.sessionId,
      mode: data.mode,
      price: data.checkout_sessions,
      success_url: data.success_url,
      cancel_url: data.cancel_url,
    };
  },
  toFirestore(snapshot) {
    console.log('Snappy >>>>>', snapshot);
    return snapshot as Checkout_Sessions;
  },
};
