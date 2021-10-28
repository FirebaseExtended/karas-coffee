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
import { FormikErrors, useFormik } from 'formik';
import { useAuthSendPasswordResetEmail } from '@react-query-firebase/auth';
import { Card } from '../components/Card';
import { Input, Error } from '../components/Form';
import { auth } from '../firebase';
import { Button } from '../components/Button';

type FormValues = {
  email: string;
};

export function ForgotPassword() {
  const send = useAuthSendPasswordResetEmail(auth);

  // Set up formik for login.
  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
    },
    validate(values) {
      const errors: FormikErrors<FormValues> = {};
      if (!values.email) errors.email = 'Please provide an email address.';
      return errors;
    },
    async onSubmit(values) {
      send.mutate({ email: values.email });
    },
  });

  return (
    <section className="max-w-xl mx-auto my-20 px-4">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900">Forgot Password</h1>
      <p className="text-center mb-4 italic text-gray-600">
        Enter your email address, we&apos;ll send a recovery link to your inbox. .
      </p>
      <Card>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <Input
            id="email"
            label="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.dirty ? formik.errors.email : undefined}
          />
          {send.isError && <Error>{send.error.message}</Error>}
          {send.isSuccess && <p>A password reset email has been set.</p>}
          <Button disabled={!formik.isValid} loading={send.isLoading} type="submit">
            Send Email
          </Button>
        </form>
      </Card>
    </section>
  );
}
