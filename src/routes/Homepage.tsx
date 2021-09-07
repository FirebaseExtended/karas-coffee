import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { ProductType } from '../types';
import { emptyArray } from '../utils';

export function Homepage() {
  return (
    <>
      <Subscribe />
      <Shop title="Shop Coffee" type="coffee" />
      <Shop title="Shop Swag" type="swag" />
    </>
  );
}

function Subscribe() {
  return (
    <section>
      <div className="mt-6 bg-gray-900 h-[400px] rounded overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-12">
            <h1 className="font-extrabold text-white text-7xl">Become your own Barista.</h1>
            <p className="mt-8 text-lg text-white">
              Subscribe today to gain exclusive access to blogs, videos & recipes so you can become your own
              professional barista.
            </p>
            <div className="w-64 mt-8">
              <Button>Subscribe Now</Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1515442261605-65987783cb6a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt=""
              className="absolute top-0 right-0 block h-64 rounded-bl shadow ring-4 ring-white"
            />
            <img
              src="https://images.unsplash.com/photo-1620360289812-0abdae69d6d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              alt=""
              className="absolute w-64 rounded shadow z-1 left-10 top-16 ring-4 ring-white"
            />
          </div>
        </div>
      </div>
    </section>
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
