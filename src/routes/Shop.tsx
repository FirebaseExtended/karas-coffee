import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { FieldPath } from 'firebase/firestore';

import { ButtonGroup } from '../components/ButtonGroup';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts, UseProductsConstraints } from '../hooks/useProducts';
import { emptyArray } from '../utils';

// Declare available filters and a type.
const filters = ['all', 'swag', 'coffee'] as const;
type Filter = typeof filters[number];

// Declare the different orderBy fields.
const orders = ['name', 'price', 'strength'] as const;
type OrderBy = typeof orders[number];

const directions = ['asc', 'desc'] as const;
type OrderByDirection = typeof directions[number];

// Create a type of the fields and valid directions.
type Order = `${OrderBy}-${OrderByDirection}`;

// Create references to the field paths of each orderBy field.
const fieldPaths: { [key in OrderBy]: FieldPath } = {
  name: new FieldPath('name'),
  price: new FieldPath('metadata', 'price_usd'),
  strength: new FieldPath('metadata', 'strength'),
};

export function Shop() {
  const [params, setParams] = useSearchParams();

  const constraints: UseProductsConstraints = {
    orders: [],
    filters: [],
  };

  // Extract the filter and validate it.
  let filter: Filter = (params.get('filter') as Filter) ?? filters[0];
  if (!filters.includes(filter)) filter = filters[0];

  // Extract the order and validate it.
  let order: Order = (params.get('order') as Order) ?? `${orders[0]}-asc`;

  if (filter !== 'all') {
    constraints.filters.push([new FieldPath('metadata', 'type'), '==', filter]);
  }

  const [orderBy, direction] = order.split('-');
  const fieldPath = fieldPaths[orderBy as OrderBy];
  const directionValue: OrderByDirection = directions.includes(direction as OrderByDirection)
    ? (direction as OrderByDirection)
    : directions[0];

  if (fieldPath) {
    constraints.orders.push([fieldPath, directionValue]);
  }

  const updateParamValue = useCallback(
    (key: string, value: string) => {
      return setParams({
        filter,
        order,
        [key]: value,
      });
    },
    [filter, order],
  );

  const products = useProducts(constraints);
  console.log(products);
  return (
    <>
      <div>
        <div className="mb-6 flex justify-end space-x-4">
          <div className="relative w-42">
            <select
              value={order}
              onChange={(e) => updateParamValue('order', e.target.value)}
              name="order"
              id="order"
              className="w-full truncate border text-sm text-indigo-700 font-bold px-4 py-1 pr-8 rounded bg-gray-50 hover:bg-gray-100 appearance-none focus:outline-none focus:border-gray-500"
            >
              <option value="name-asc">Name: A-Z (ASC)</option>
              <option value="name-desc">Name: Z-A (DESC)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="strength-asc">Strength: Low to High</option>
              <option value="strength-desc">Strength: High to Low</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-indigo-700 absolute top-[6px] right-2" />
          </div>
          <ButtonGroup<Filter>
            active={filter}
            onClick={(id) => updateParamValue('filter', id)}
            buttons={[
              { id: 'all', children: 'All' },
              { id: 'swag', children: 'Swag' },
              { id: 'coffee', children: 'Coffee' },
            ]}
          />
        </div>
        <section className="flex-row md:grid md:flex-col md:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {products.status === 'loading' && emptyArray(8).map((_, i) => <ProductCardSkeleton key={i} />)}
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
        </section>
      </div>
    </>
  );
}
