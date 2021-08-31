import { orderBy, query } from 'firebase/firestore';
import { collections } from './index';

export function getProducts() {
  return query(collections.products, orderBy('name'));
}
