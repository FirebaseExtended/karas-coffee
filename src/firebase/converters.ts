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
        origin: data.metadata?.origin ?? '',
        strength: data.metadata?.strength ?? '',
        variety: data.metadata?.variety ?? '',
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
      created_at: (data.created_at as Timestamp).toDate(),
      product_id: data.product_id,
      rating: data.rating ?? 0,
      message: data.message ?? '',
      user: {
        id: data.user.id,
        display_name: data.user.display_name,
        photo_url: data.user.photo_url,
      },
      attribute_scores: data.attribute_scores,
    };
  },
  toFirestore(review: Review) {
    return {
      created_at: review.created_at,
      product_id: review.product_id,
      rating: review.rating ?? 0,
      message: review.message ?? '',
      user: {
        id: review.user.id,
        display_name: review.user.display_name,
        photo_url: review.user.photo_url,
      },
    };
  },
};
