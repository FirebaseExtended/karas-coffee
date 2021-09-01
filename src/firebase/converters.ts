import { FirestoreDataConverter } from 'firebase/firestore';
import slugify from 'slugify';
import { Product } from '../types';

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
