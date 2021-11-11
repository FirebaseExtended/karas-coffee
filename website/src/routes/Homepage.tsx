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
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { ProductType } from '../types';
import { emptyArray } from '../utils';

import { useCheckout } from '../hooks/useCheckout';
import { useSubscription } from '../hooks/useSubscription';
import { useContent } from '../hooks/useContent';
import { ContentCard, ContentCardSkeleton } from '../components/ContentCard';
import { Heading } from '../components/Heading';
import { useUser } from '../hooks/useUser';
import { limit, where } from '@firebase/firestore';

export function Homepage() {
  const user = useUser();

  return (
    <>
      {!!user.data && <Hero />}
      {!user.data && <Subscribe />}
      <Shop title="Coffee Shop" type="coffee" />
      <Shop title="Swag Shop" type="swag" />
    </>
  );
}

function Hero() {
  const subscription = useSubscription();

  if (!subscription.isSuccess) {
    return (
      <section className="grid grid-cols-2 gap-6 mt-4">
        {emptyArray(4).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (!subscription.data) {
    return <Subscribe />;
  }

  return <Content />;
}

function Content() {
  const content = useContent('homepage', 4);

  return (
    <div className="px-4 lg:px-0 text-gray-800">
      <Heading
        actions={[
          <Link key="content" to="/content" className="text-indigo-700 hover:underline">
            View all content
          </Link>,
        ]}
      >
        Your daily coffee content
      </Heading>
      <section className="grid-cols-2 gap-6 mt-4 space-y-6 lg:space-y-0 lg:grid">
        {content.isLoading && emptyArray(4).map((_, i) => <ContentCardSkeleton key={i} />)}
        {content.isSuccess && content.data.map((content) => <ContentCard key={content.title} content={content} />)}
      </section>
    </div>
  );
}

function Subscribe() {
  const { trigger, error, loading } = useCheckout();

  const createSubscription = async () => {
    await trigger({
      mode: 'subscription',
      success_url: `${window.location.origin}/account/subscription`,
      cancel_url: window.location.href,
      line_items: [
        {
          // TODO(ehesp): Make const or handle multiple subscription products
          price: 'price_1JZYqLDPaZ24HcpvFAXEs4WJ',
          quantity: 1,
        },
      ],
      collect_shipping_address: false,
    });
  };

  return (
    <section className="px-4 lg:px-0">
      <div className="mt-6 bg-gray-900 h-[400px] rounded overflow-hidden">
        <div className="grid-cols-2 lg:grid">
          <div className="p-12 text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-white lg:text-6xl">Become your own Barista.</h1>
            <p className="mt-8 text-lg text-white">
              Subscribe today to gain exclusive access to blogs, videos & recipes so you can become your own
              professional barista.
            </p>
            <div className="w-64 mx-auto mt-8 lg:mx-0">
              <Button onClick={() => createSubscription()} loading={loading}>
                Subscribe Now
              </Button>
              {!!error && <div className="mt-2 text-sm text-red-500">{error}</div>}
            </div>
          </div>
          <div className="relative hidden lg:block">
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
  const products = useProducts(['homepage', type], [limit(4), where('metadata.type', '==', type)]);

  return (
    <div className="px-4">
      <Heading
        actions={[
          <Link key="shop" to="/shop" className="text-indigo-700 hover:underline">
            View all products
          </Link>,
        ]}
      >
        {title}
      </Heading>
      <section className="flex-row lg:grid lg:flex-col lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
        {!products.isSuccess && emptyArray(4).map((_, i) => <ProductCardSkeleton key={i} />)}
        {products.isSuccess && products.data.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </div>
  );
}
