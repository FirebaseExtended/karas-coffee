import { DocumentData, FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { Product, Review } from '../types';

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot): Product {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      active: !!data.active,
      description: data.description || '',
      images: data.images || [],
      metadata: data.metadata,
      name: data.name || '',
      role: data.role,
      tax_code: data.tax_code,
    };
  },
  toFirestore() {
    throw new Error('Client does not support updating products.');
  },
};

export const reviewConverter: FirestoreDataConverter<Review> = {
  fromFirestore(snapshot): Review {
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
