import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { ProductType } from '../types';
import { emptyArray } from '../utils';

export function Homepage() {
  return (
    <>
      <Shop title="Shop Coffee" type="coffee" />
      <Shop title="Shop Swag" type="swag" />
    </>
  );
}

type ShopProps = {
  title: string;
  type: ProductType;
};

function Shop({ title, type }: ShopProps) {
  const limit = 4;
  const products = useProducts({ limitTo: limit, orders: [], filters: [['metadata.type', '==', type]] });

  return (
    <>
      <div className="flex items-center my-8">
        <h2 className="flex-grow text-3xl font-extrabold tracking-wide">{title}</h2>
        <Link to="/shop" className="text-indigo-700 hover:underline">
          View all products
        </Link>
      </div>
      <section className="flex-row md:grid md:flex-col md:grid-cols-4 md:gap-x-6 md:gap-y-12">
        {products.status === 'loading' && emptyArray(limit).map((_, i) => <ProductCardSkeleton key={i} />)}
        {products.status === 'success' &&
          products.data.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </>
  );
}
