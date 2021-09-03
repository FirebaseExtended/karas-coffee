import React from 'react';
import { FormikErrors, FormikHelpers, useFormik } from 'formik';
import { Label, TextArea, Error } from './Form';
import { Stars } from './Stars';
import { Button } from './Button';

type FormValues = {
  message: string;
  stars: number;
};

export type WriteReviewCardProps = {
  initialMessage?: string;
  initialStars?: number;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => Promise<void>;
};

export function WriteReviewCard({ initialMessage, initialStars, onSubmit }: WriteReviewCardProps) {
  const formik = useFormik<FormValues>({
    initialValues: {
      message: initialMessage ?? '',
      stars: initialStars ?? 0,
    },
    validate(values) {
      const errors: FormikErrors<FormValues> = {};
      if (!values.message) errors.message = 'Please provide an message.';
      if (values.message && values.message.length < 20) errors.message = 'Please provide longer review.';
      if (values.message && values.message.length > 500) errors.message = 'Please provide shorter review.';
      if (values.stars < 1) errors.stars = 'Please provide a rating.';
      return errors;
    },
    async onSubmit(values, helpers) {
      try {
        await onSubmit(values, helpers);
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
