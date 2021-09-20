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

export function Homepage() {
  return (
    <>
      <Hero />
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
    <div>
      <Heading
        actions={[
          <Link key="content" to="/content" className="text-indigo-700 hover:underline">
            View all content
          </Link>,
        ]}
      >
        Your daily coffee content
      </Heading>
      <section className="grid grid-cols-2 gap-6 mt-4">
        {content.isLoading && emptyArray(4).map((_, i) => <ContentCardSkeleton key={i} />)}
        {content.isSuccess && content.data.map((content) => <ContentCard key={content.title} content={content} />)}
      </section>
    </div>
  );
}

function Subscribe() {
  const { checkout, error, loading } = useCheckout();

  const addSubscription = async () =>
    await checkout({
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
              <Button onClick={() => addSubscription()} loading={loading}>
                Subscribe Now
              </Button>
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
  const products = useProducts(['homepage', type], {
    limitTo: limit,
    orders: [],
    filters: [['metadata.type', '==', type]],
  });

  return (
    <>
      <Heading
        actions={[
          <Link key="shop" to="/shop" className="text-indigo-700 hover:underline">
            View all products
          </Link>,
        ]}
      >
        {title}
      </Heading>
      <section className="flex-row md:grid md:flex-col md:grid-cols-4 md:gap-x-6 md:gap-y-12">
        {!products.isSuccess && emptyArray(limit).map((_, i) => <ProductCardSkeleton key={i} />)}
        {products.isSuccess && products.data.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </>
  );
}
