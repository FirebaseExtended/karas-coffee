import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, XIcon } from '@heroicons/react/outline';
import { GlobeIcon, QuestionMarkCircleIcon, SunIcon } from '@heroicons/react/solid';

import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { Tooltip } from './Tooltip';
import { Skeleton } from './Skeleton';

export type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, getItem } = useCart();

  const href = `/product/${product.id}`;
  const inCart = !!getItem(product);

  return (
    <div className="flex flex-col">
      <div className="relative flex-shrink-0 block group">
        <div className="overflow-hidden rounded group-hover:shadow-lg">
          <Link to={href} className="block">
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-48 transition-all group-hover:scale-105"
            />
          </Link>

          <div
            role="button"
            onClick={() => {
              if (inCart) {
                removeFromCart(product);
              } else {
                addToCart(product);
              }
            }}
            className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 transition-opacity rounded-tr rounded-bl opacity-0 group group-hover:opacity-100 bg-black/90"
          >
            {inCart ? <XIcon className="w-6 h-6 text-white" /> : <ShoppingBagIcon className="w-6 h-6 text-white" />}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow mt-4">
        <div className="flex items-center">
          <h3 className="flex-grow truncate">
            <Link to={href} className="font-bold tracking-wide hover:underline">
              {product.name}
            </Link>
          </h3>
          <h4 className="ml-2 font-medium">${product.metadata.price_usd}</h4>
        </div>
        <div className="mt-4">
          <ProductMetadata product={product} />
        </div>
        <p className="flex-grow mt-4 text-sm text-gray-500">{product.description}</p>
      </div>
    </div>
  );
}

export type ProductMetadataProps = {
  product: Product;
};

export function ProductMetadata({ product }: ProductMetadataProps) {
  return (
    <div className="flex space-x-6 text-xs text-gray-600">
      <Tooltip label="Origin">
        <div className="flex space-x-1">
          <GlobeIcon className="w-4 h-4" />
          <span className="font-bold">{product.metadata.origin}</span>
        </div>
      </Tooltip>
      <Tooltip label="Variety">
        <div className="flex space-x-1">
          <QuestionMarkCircleIcon className="w-4 h-4" />
          <span className="font-bold">{product.metadata.variety}</span>
        </div>
      </Tooltip>
      <Tooltip label="Strength">
        <div className="flex space-x-1">
          <SunIcon className="w-4 h-4" />
          <span className="font-bold">{product.metadata.strength}</span>
        </div>
      </Tooltip>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-48 rounded" />
      <div className="flex mt-4">
        <div className="flex-grow">
          <Skeleton className="w-1/2 h-6" />
        </div>
        <Skeleton className="w-10 h-6" />
      </div>
      <div className="flex space-x-4 mt-4">
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-12 h-4" />
      </div>
      <div className="flex flex-col mt-4 space-y-1">
        <Skeleton className="h-3" />
        <Skeleton className="h-3 mr-8" />
        <Skeleton className="h-3 mr-24" />
      </div>
    </div>
  );
}
