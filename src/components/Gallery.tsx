import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export type GalleryProps = {
  initialIndex?: number;
  images: string[];
};

export function Gallery({ initialIndex = 0, images }: GalleryProps) {
  const [active, setActive] = useState<number>(initialIndex);
  const visible = images[active];
  const scroll = useHorizontalScroll();

  const refs: HTMLImageElement[] = [];

  useEffect(() => {
    const img = refs[active];

    // Scroll the image element into view.
    if (img) {
      img.scrollIntoView({ behavior: 'smooth', inline: 'end' });
    }
  }, [active]);

  function onLeft() {
    setActive((current) => {
      if (current === 0) return images.length - 1;
      return current - 1;
    });
  }

  function onRight() {
    setActive((current) => {
      if (current === images.length - 1) return 0;
      return current + 1;
    });
  }

  return (
    <div className="relative">
      <div className="relative">
        <img src={visible} alt={`Gallery item #${active}`} className="rounded object-cover" />
        {images.length > 1 && (
          <div className="absolute bottom-5 right-5 flex place-items-center shadow-xl">
            <button
              onClick={onLeft}
              className="px-8 py-2 bg-white/90 hover:bg-gray-100 rounded-bl rounded-tl border-l border-t border-b"
            >
              <ArrowLeftIcon className="w-5" />
            </button>
            <button onClick={onRight} className="px-8 py-2 bg-white/90 hover:bg-gray-100 rounded-br rounded-tr border">
              <ArrowRightIcon className="w-5" />
            </button>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="h-40">
          <div ref={scroll} className="mt-4 absolute inset-x-0 overflow-x-scroll h-46">
            <ul className="flex px-2 py-3">
              {images.map((src, index) => (
                <img
                  role="button"
                  onClick={() => setActive(index)}
                  ref={(ref) => {
                    if (ref) refs[index] = ref;
                  }}
                  key={src}
                  src={src}
                  className={cx('rounded h-36 mr-4', {
                    'ring-4 ring-indigo-500 ring-offset-2': active === index,
                  })}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
