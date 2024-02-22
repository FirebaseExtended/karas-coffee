import { useFunctionsQuery } from '@react-query-firebase/functions';
import { functions } from '../firebase';

export function useVectorSearch(query: string, limit: number) {
  return useFunctionsQuery<
    {
      query: string;
      limit: number;
    },
    { ids: string[] }
  >(
    ['concierge', query],
    functions,
    'ext-firestore-vector-search-queryCallable',
    {
      query,
      limit,
    },
    {},
    {
      enabled: !!query,
    },
  );
}
