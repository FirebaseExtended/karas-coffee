import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, XIcon } from '@heroicons/react/outline';
import { GlobeIcon, QuestionMarkCircleIcon, SunIcon } from '@heroicons/react/solid';

import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { Tooltip } from './Tooltip';

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
          <Link to={href}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover transition-all group-hover:scale-105"
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
            className="group absolute top-0 right-0 rounded-tr rounded-bl transition-opacity opacity-0 group-hover:opacity-100 bg-black/90 h-12 w-12 flex items-center justify-center"
          >
            {inCart ? <XIcon className="w-6 h-6 text-white" /> : <ShoppingBagIcon className="w-6 h-6 text-white" />}
          </div>
        </div>
      </div>
      <div className="mt-4 flex-grow flex flex-col">
        <div className="flex items-center">
          <h3 className="flex-grow truncate">
            <Link to={href} className="font-bold tracking-wide hover:underline">
              {product.name}
            </Link>
          </h3>
          <h4 className="ml-2 font-medium">${product.metadata.price_usd}</h4>
        </div>
        <div className="mt-4 text-xs flex space-x-6 text-gray-600">
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
        <p className="flex-grow mt-4 text-sm text-gray-500">{product.description}</p>
      </div>
    </div>
  );
}
