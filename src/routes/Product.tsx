import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Link, useParams } from 'react-router-dom';
import { FormikErrors, useFormik } from 'formik';
import { formatDistance, formatRelative } from 'date-fns';

import { Button } from '../components/Button';
import { Input, Label, TextArea, Error } from '../components/Form';
import { Gallery } from '../components/Gallery';
import { Stars } from '../components/Stars';
import { Tooltip } from '../components/Tooltip';

import { useCart } from '../hooks/useCart';
import { useProduct } from '../hooks/useProduct';
import { useReviewMutation } from '../hooks/useReviewMutation';
import { useReviews } from '../hooks/useReviews';

export function Product() {
  const { id } = useParams();
  const product = useProduct(id);
  const { addToCart, removeFromCart, getItem, setQuantity } = useCart();

  if (product.status === 'loading') {
    return <div />;
  }

  if (product.status === 'error' || !product.data) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-600">
        Sorry, something went wrong loading this product.
      </div>
    );
  }

  const cartItem = getItem(product.data);

  return (
    <>
      <section className="mt-8">
        <div className="grid grid-cols-2 gap-12">
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
              {!!cartItem && (
                <div className="mt-4 flex items-center">
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
                        setQuantity(product.data, quantity);
                      }}
                    />
                  </div>
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <XIcon
                      role="button"
                      className="w-5 h-5 mt-7 hover:opacity-50"
                      onClick={() => removeFromCart(product.data)}
                    />
                  </div>
                </div>
              )}
              {!cartItem && <Button onClick={() => addToCart(product.data)}>Add to cart</Button>}
            </div>
          </div>
        </div>
      </section>
      <Reviews productId={product.data.id} />
    </>
  );
}

function Reviews({ productId }: { productId: string }) {
  return (
    <section className="mt-24">
      <div className="max-w-xl mx-auto">
        <h2 className="mb-2 text-4xl font-extrabold tracking-wide">Reviews</h2>
        <div className="mt-8">
          <WriteAReview productId={productId} />
        </div>
        <ListReviews productId={productId} />
      </div>
    </section>
  );
}

type Review = {
  message: string;
  stars: number;
};

function WriteAReview({ productId }: { productId: string }) {
  const addReview = useReviewMutation(productId);

  const formik = useFormik<Review>({
    initialValues: {
      message: '',
      stars: 0,
    },
    validate(values) {
      const errors: FormikErrors<Review> = {};
      if (!values.message) errors.message = 'Please provide an email address.';
      if (values.message && values.message.length < 20) errors.message = 'Please provide longer review.';
      if (values.message && values.message.length > 500) errors.message = 'Please provide shorter review.';
      if (values.stars < 1) errors.stars = 'Please provide a rating.';
      return errors;
    },
    async onSubmit(values, helpers) {
      try {
        await addReview({
          rating: values.stars,
          message: values.message,
        });
        helpers.resetForm();
      } catch (e: any) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        helpers.setStatus(e?.message || 'Something went wrong.');
      }
    },
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <TextArea
        label="Write your own review:"
        rows={5}
        id="message"
        value={formik.values.message}
        onChange={formik.handleChange}
        error={formik.dirty ? formik.errors.message : undefined}
      />
      <div>
        <Label id="stars">Rate this product:</Label>
        <Stars
          max={5}
          current={formik.values.stars}
          size="lg"
          onSelect={(value) => formik.setFieldValue('stars', value)}
        />
        {formik.dirty && !!formik.errors.stars && <Error>{formik.errors.stars}</Error>}
      </div>
      <div>
        <Button disabled={!formik.isValid} loading={formik.isSubmitting} type="submit">
          Submit Review
        </Button>
      </div>
    </form>
  );
}

function ListReviews({ productId }: { productId: string }) {
  const reviews = useReviews(productId);
  console.log(reviews);
  return (
    <div className="divide-y">
      {reviews.status === 'success' &&
        reviews.data.map((review) => (
          <div key={review.id} className="py-12">
            <div className="flex items-center">
              {!!review.user.photo_url && (
                <img
                  src={review.user.photo_url}
                  alt={review.user.display_name}
                  className="w-10 h-10 rounded-full mr-4 shadow"
                />
              )}
              <div>
                <h4 className="font-bold track w-64 truncate">{review.user.display_name}</h4>
                <p className="text-sm text-gray-600">
                  <Tooltip label={formatRelative(review.created_at, new Date())}>
                    <span>{formatDistance(review.created_at, new Date(), { addSuffix: true })}</span>
                  </Tooltip>
                </p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Stars max={5} current={review.rating} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{review.message}</p>
          </div>
        ))}
    </div>
  );
}
