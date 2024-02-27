import { useFunctionsQuery } from '@react-query-firebase/functions';
import { collections, functions } from '../firebase';
import { query, where } from 'firebase/firestore';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';

export function useVectorSearch(queryString: string, limit: number) {
  const vectorSearchResults = useFunctionsQuery<
    {
      query: string;
      limit: number;
    },
    { ids: string[] }
  >(
    ['concierge', queryString],
    functions,
    'ext-firestore-vector-search-queryCallable',
    {
      query: queryString,
      limit,
    },
    {},
    {
      enabled: !!queryString,
    },
  );

  const ids = vectorSearchResults.data?.ids;

  const q = ids ? query(collections.products, where('id', 'in', ids)) : query(collections.products);

  const results = useFirestoreQueryData(
    ['recommendations', ids],
    q,
    {},
    {
      enabled: !vectorSearchResults.isLoading && !vectorSearchResults.isError && !!ids && ids.length > 1, // Ensure the query is only run when ids are available
    },
  );

  return results;
}
