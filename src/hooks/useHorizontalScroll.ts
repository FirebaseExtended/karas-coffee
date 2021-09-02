import { useEffect, useRef } from 'react';

export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  function onScroll(e: WheelEvent) {
    e.preventDefault();
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY;
    }
  }

  useEffect(() => {
    ref.current?.addEventListener('wheel', onScroll);
    return () => ref.current?.removeEventListener('wheel', onScroll);
  }, [ref]);

  return ref;
}
