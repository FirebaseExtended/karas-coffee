import { useEffect, useRef } from 'react';

// https://usehooks.com/useMemoCompare
export function useMemoCompare<T>(next: T, compare: (prev: T | undefined) => boolean) {
  const previousRef = useRef<T>();
  const previous = previousRef.current;

  const isEqual = compare(previous);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  // Finally, if equal then return the previous value
  return previous && isEqual ? previous : next;
}
