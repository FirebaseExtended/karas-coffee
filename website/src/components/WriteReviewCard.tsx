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

import React, { useEffect } from 'react';
import { FormikErrors, FormikHelpers, useFormik } from 'formik';
import { useFilePicker } from 'use-file-picker';
import { Label, TextArea, Error } from './Form';
import { Stars } from './Stars';
import { Button } from './Button';

type FormValues = {
  message: string;
  stars: number;
  files: File[];
};

export type WriteReviewCardProps = {
  initialMessage?: string;
  initialStars?: number;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => Promise<void>;
};

export function WriteReviewCard({ initialMessage, initialStars, onSubmit }: WriteReviewCardProps) {
  const [openFilePicker, files] = useFilePicker({
    accept: 'image/*',
    multiple: true,
    limitFilesConfig: { max: 5 },
    maxFileSize: 10,
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      message: initialMessage ?? '',
      stars: initialStars ?? 0,
      files: [],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        helpers.setStatus(e?.message || 'Something went wrong.');
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('files', [...formik.values.files, ...files.plainFiles]);
  }, [files.plainFiles]);

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
      <div className="flex items-center">
        <div className="flex-grow">
          <Label id="stars">Rate this product:</Label>
          <Stars
            max={5}
            current={formik.values.stars}
            size="lg"
            onSelect={(value) => formik.setFieldValue('stars', value)}
          />
          {formik.dirty && !!formik.errors.stars && <Error>{formik.errors.stars}</Error>}
        </div>
        <button type="button" className="text-sm text-indigo-500 hover:underline" onClick={openFilePicker}>
          Attach Images &rarr;
        </button>
      </div>
      <div className="divide-y">
        {formik.values.files.map((file, index) => (
          <div key={file.name + index} className="flex items-center text-sm text-gray-500 py-1">
            <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 mr-2" />
            <div className="flex-grow">{file.name}</div>
            <button
              type="button"
              className="hover:underline hover:text-gray-800 text-xs"
              onClick={() => {
                const files = [...formik.values.files];
                files.splice(index, 1);
                formik.setFieldValue('files', files);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div>
        <Button disabled={!formik.isValid} loading={formik.isSubmitting} type="submit">
          Submit Review
        </Button>
      </div>
    </form>
  );
}
