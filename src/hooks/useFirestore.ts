import { DocumentReference, getDoc, getDocs, onSnapshot, Query, queryEqual, Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { usePrevious } from './usePrevious';

type UseFirestoreOptions = {
  subscribe?: boolean;
};

export function useFirestoreQuery<T>(key: string | string[], query: Query<T>, options?: UseFirestoreOptions) {
  const client = useQueryClient();
  const subscribe = options?.subscribe ?? false;
  const previousQuery = usePrevious(query);
  const queryKey = useFirestoreQueryKey(key);
  const isEqual = !!previousQuery && queryEqual(previousQuery, query);
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    if (subscribe && !isEqual) {
      unsubscribe.current = onSnapshot(query, (snapshot) => {
        client.setQueryData(
          queryKey,
          snapshot.docs.map((doc) => doc.data()),
        );
      });
    }
  }, [subscribe, isEqual, query]);

  useEffect(() => {
    if (!isEqual && !!previousQuery) {
      return () => {
        unsubscribe.current?.();
      };
    }
  }, [unsubscribe, isEqual, previousQuery]);

  return useQuery(queryKey, async () => {
    const snapshot = await getDocs(query);
    return snapshot.docs.map((doc) => doc.data());
  });
}

export function useFirestoreDocument<T>(
  key: string | string[],
  ref: DocumentReference<T>,
  options?: UseFirestoreOptions,
) {
  const client = useQueryClient();
  const subscribe = options?.subscribe ?? false;
  const previousRef = usePrevious(ref);
  const queryKey = useFirestoreDocumentKey(key);
  const isEqual = !!previousRef && ref.id === previousRef.id;
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    if (subscribe && !isEqual) {
      unsubscribe.current = onSnapshot(ref, (snapshot) => {
        client.setQueryData(queryKey, snapshot.data());
      });
    }
  }, [subscribe, isEqual, ref]);

  useEffect(() => {
    if (!isEqual && !!previousRef) {
      return () => {
        unsubscribe.current?.();
      };
    }
  }, [unsubscribe, isEqual, previousRef]);

  return useQuery(queryKey, async () => {
    const snapshot = await getDoc(ref);
    return snapshot.data();
  });
}

export function useFirestoreQueryKey(key: string | string[]): string[] {
  const queryKey = Array.isArray(key) ? key : [key];
  return ['firestore', 'query', ...queryKey];
}

export function useFirestoreDocumentKey(key: string | string[]): string[] {
  const queryKey = Array.isArray(key) ? key : [key];
  return ['firestore', 'doc', ...queryKey];
}
