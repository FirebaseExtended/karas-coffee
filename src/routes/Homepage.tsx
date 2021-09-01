import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ButtonGroup } from '../components/ButtonGroup';
import { ProductCard } from '../components/ProductCard';
import { useProducts, UseProductsConstraints } from '../hooks/useProducts';

// Declare available filters and a type.
const filters = ['all', 'swag', 'coffee'] as const;
type Filter = typeof filters[number];

export function Homepage() {
  const [params, setParams] = useSearchParams();

  // Extract the filter and validate it.
  let filter: Filter = (params.get('filter') as Filter) ?? 'all';
  if (!filters.includes(filter)) filter = 'all';

  const constraints: UseProductsConstraints = {
    orders: [],
    filters: [],
  };

  if (filter !== 'all') {
    constraints.filters.push(['type', '==', filter]);
  }

  constraints.orders.push(['name', undefined]);

  const products = useProducts(constraints);

  return (
    <>
      <div>
        <div className="mb-6 flex justify-end space-x-6">
          <div>Sort by: price</div>
          <ButtonGroup<Filter>
            active={filter}
            onClick={(id) => setParams({ filter: id })}
            buttons={[
              { id: 'all', children: 'All' },
              { id: 'swag', children: 'Swag' },
              { id: 'coffee', children: 'Coffee' },
            ]}
          />
        </div>
        <section className="grid grid-cols-4 gap-x-6 gap-y-12">
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
          {products.status === 'success' &&
            products.data.map((product) => <ProductCard key={product.id} product={product} />)}
        </section>
      </div>
    </>
  );
}
