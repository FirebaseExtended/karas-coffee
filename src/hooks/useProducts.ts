import { getProducts } from '../firebase/queries';
import { useQuery } from './useQuery';

export function useProducts() {
  return useQuery<string>(getProducts());
}
