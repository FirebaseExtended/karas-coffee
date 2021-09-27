import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FieldPath, orderBy, QueryConstraint, where } from 'firebase/firestore';

import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { emptyArray } from '../utils';
import { Select } from '../components/Form';
import { ButtonGroup } from '../components/ButtonGroup';

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

  let constraints: undefined | QueryConstraint[] | string = [];

  // Extract the filter and validate it.
  let filter: Filter = (params.get('filter') as Filter) ?? 'all';
  if (!filters.includes(filter)) filter = filters[0];

  // Extract the order and validate it.
  let [order, direction] = ((params.get('order') as Order) ?? `${orders[0]}-asc`).split('-');

  const fieldPath = fieldPaths[order as OrderBy];
  const directionValue: OrderByDirection = directions.includes(direction as OrderByDirection)
    ? (direction as OrderByDirection)
    : directions[0];

  if (filter == 'all' && order === 'name-asc') {
    // If the default filters are in place, use the named query created called "shop".
    constraints = 'shop';
  } else {
    if (filter !== 'all') {
      constraints.push(where('metadata.type', '==', filter));
    } else {
      constraints.push(where('metadata.type', '!=', 'subscription'));
      constraints.push(orderBy('metadata.type'));
    }

    if (fieldPath) {
      constraints.push(orderBy(fieldPath, directionValue));
    }
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

  const products = useProducts(
    [
      'shop',
      {
        filter,
        order: `${order}-${direction}`,
      },
    ],
    constraints,
  );

  return (
    <>
      <div>
        <div className="mb-6 flex justify-end space-x-4">
          <Select
            value={`${order}-${direction}`}
            onChange={(e) => updateParamValue('order', e.target.value)}
            id="order"
            options={[
              {
                value: 'name-asc',
                label: 'Name: A-Z',
              },
              {
                value: 'name-desc',
                label: 'Name: Z-A',
              },
              {
                value: 'price-asc',
                label: 'Price: Low to High',
              },
              {
                value: 'price-desc',
                label: 'Price: High to Low',
              },
              {
                value: 'strength-asc',
                label: 'Strength: Low to High',
              },
              {
                value: 'strength-desc',
                label: 'Strength: High to Low',
              },
            ]}
          />
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
          {products.isLoading && emptyArray(8).map((_, i) => <ProductCardSkeleton key={i} />)}
          {products.isSuccess && products.data.map((product) => <ProductCard key={product.id} product={product} />)}
        </section>
      </div>
    </>
  );
}
