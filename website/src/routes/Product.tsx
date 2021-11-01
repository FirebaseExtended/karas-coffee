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

import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { Input } from '../components/Form';
import { Gallery } from '../components/Gallery';

import { useCart } from '../hooks/useCart';
import { useProduct } from '../hooks/useProduct';
import { useReviewMutation } from '../hooks/useReviewMutation';
import { useProductReview, useProductReviews } from '../hooks/useReviews';
import { ReviewCard, ReviewCardSkeleton } from '../components/ReviewCard';
import { emptyArray } from '../utils';
import { WriteReviewCard } from '../components/WriteReviewCard';
import { useUser } from '../hooks/useUser';
import { Alert } from '../components/Alert';

export function Product() {
  const user = useUser();
  const { id } = useParams();
  const product = useProduct(id!);
  const navigate = useNavigate();
  const { addToCart, removeFromCart, getItem, setQuantity } = useCart();

  if (product.isLoading) {
    return <div />;
  }

  if (product.isError || !product.data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        Sorry, something went wrong loading this product.
      </div>
    );
  }

  const cartItem = getItem(product.data);

  return (
    <>
      <section className="mt-8 px-4 lg:px-0">
        <div className="flex flex-col-reverse lg:grid grid-cols-2 gap-12">
          <div>
            <Gallery images={product.data.images} />
          </div>
          <div>
            <Link to="/" className="block mb-4 text-sm text-gray-600 hover:underline">
              &laquo; Back to products
            </Link>
            <h1 className="mb-2 text-4xl font-extrabold tracking-wide">{product.data.name}</h1>
            <div className="text-3xl text-gray-600">${product.data.metadata.price_usd}</div>
            <p className="mt-6 text-gray-600">{product.data.description}</p>
            <div className="mt-6">
              {!!cartItem && user.data && (
                <div className="flex items-center mt-4">
                  <div className="flex-grow">
                    <Input
                      id={`quantity-${product.data.id}`}
                      type="number"
                      label="Quantity"
                      value={cartItem.quantity}
                      max="100"
                      min="1"
                      onChange={(e) => {
                        let quantity = parseInt(e.target.value);
                        if (isNaN(quantity) || quantity < 1) quantity = 1;
                        if (quantity > 100) quantity = 100;
                        setQuantity(product.data!, quantity);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center flex-shrink-0 w-10">
                    <XIcon
                      role="button"
                      className="w-5 h-5 mt-7 hover:opacity-50 text-red-400"
                      onClick={() => removeFromCart(product.data!)}
                    />
                  </div>
                </div>
              )}
              {!cartItem && (
                <Button
                  onClick={() => {
                    if (user.data) {
                      addToCart(product.data!);
                    } else {
                      navigate('/signin');
                    }
                  }}
                >
                  Add to cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-xl mx-auto mt-25 px-4 lg:px-0">
        {!!user && <Review productId={product.data.id} />}
        <ListReviews productId={product.data.id} />
      </section>
    </>
  );
}

function Review({ productId }: { productId: string }) {
  const user = useUser();

  if (!user?.data) return null;

  const review = useProductReview(productId, user?.data!.uid);
  const addReview = useReviewMutation(productId);
  const [edit, setEdit] = useState<boolean>(false);

  const userReview = review.data;

  return (
    <section className="mt-24">
      <div className="max-w-xl mx-auto">
        <div className="mt-8">
          {review.status === 'loading' && <ReviewCardSkeleton />}
          {!edit && review.status === 'success' && !!userReview && (
            <>
              <ReviewCard review={userReview!} />
              <div className="mt-4">
                <Button onClick={() => setEdit(true)}>Edit your review</Button>
              </div>
            </>
          )}
          {review.status === 'success' && !userReview && (
            <WriteReviewCard
              onSubmit={async (values) => {
                await addReview.mutateAsync({
                  rating: values.stars,
                  message: values.message,
                  files: values.files,
                });
              }}
            />
          )}
          {!!edit && !!userReview && (
            <>
              <WriteReviewCard
                initialMessage={userReview.message}
                initialStars={userReview.rating}
                onSubmit={async (values) => {
                  await addReview.mutateAsync({
                    rating: values.stars,
                    message: values.message,
                  });
                  setEdit(false);
                }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ListReviews({ productId }: { productId: string }) {
  const reviews = useProductReviews(productId);

  const wrapper = (children: React.ReactNode, key: string) => (
    <div className="py-12" key={key}>
      {children}
    </div>
  );

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-3xl font-extrabold tracking-wide">Reviews</h2>
      <Alert type="warning">For this demo application, only your own reviews are currently visible.</Alert>
      <div className="divide-y">
        {reviews.status === 'loading' && emptyArray(5).map((_, i) => wrapper(<ReviewCardSkeleton />, `${i}`))}
        {reviews.status === 'success' && (
          <>
            {reviews.data.length === 0 && (
              <p className="mt-4 text-gray-600">
                There are no reviews for this product, grab a coffee and be the first to write one!
              </p>
            )}
            {reviews.data.map((review) => wrapper(<ReviewCard review={review} />, review.id))}
          </>
        )}
      </div>
    </div>
  );
}
