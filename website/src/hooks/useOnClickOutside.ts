import { RefObject, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    // Function for detecting outside clicks
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    // Bind the event listener for mousedown and touchstart events
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Re-run if ref or handler changes
}
