/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, XIcon } from '@heroicons/react/outline';
import { GlobeIcon, QuestionMarkCircleIcon, SunIcon } from '@heroicons/react/solid';

import { isProductCoffee, Product, ProductCoffee } from '../types';
import { useCart } from '../hooks/useCart';
import { Tooltip } from './Tooltip';
import { Skeleton } from './Skeleton';
import { useUser } from '../hooks/useUser';

export type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const user = useUser();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItem } = useCart();

  const href = `/product/${product.id}`;
  const inCart = !!getItem(product);

  return (
    <div className="flex flex-col">
      <div className="relative flex-shrink-0 block group">
        <div className="overflow-hidden rounded shadow group-hover:shadow-lg">
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
              if (user.data) {
                if (inCart) {
                  removeFromCart(product);
                } else {
                  addToCart(product);
                }
              } else {
                navigate('/signin');
              }
            }}
            className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 transition-opacity rounded-tr rounded-bl bg-black/90"
          >
            {inCart ? (
              <XIcon className="w-6 h-6 text-red-400" />
            ) : (
              <ShoppingCartIcon className="w-6 h-6 text-green-400" />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow mt-4">
        <div className="flex items-center">
          <h3 className="flex-grow truncate">
            <Link to={href} className="font-bold tracking-wide hover:underline text-gray-900">
              {product.name}
            </Link>
          </h3>
          <h4 className="ml-2 font-medium">${product.metadata.price_usd}</h4>
        </div>
        {isProductCoffee(product) && (
          <div className="mt-4">
            <ProductCoffeeMetadata product={product} />
          </div>
        )}
        <p className="flex-grow mt-4 text-sm text-gray-500">{product.description}</p>
      </div>
    </div>
  );
}

export type ProductMetadataProps = {
  product: ProductCoffee;
};

export function ProductCoffeeMetadata({ product }: ProductMetadataProps) {
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
      <div className="flex flex-col mt-4 space-y-3">
        <Skeleton className="h-3" />
        <Skeleton className="h-3 mr-8" />
        <Skeleton className="h-3 mr-24" />
      </div>
    </div>
  );
}
