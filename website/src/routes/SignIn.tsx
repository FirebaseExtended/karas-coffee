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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthSignInWithEmailAndPassword } from '@react-query-firebase/auth';

import { Card } from '../components/Card';
import { Input, Error, Divider } from '../components/Form';
import { SocialProviders } from '../components/SocialProviders';
import { auth } from '../firebase';
import { Button } from '../components/Button';

type FormValues = {
  email: string;
  password: string;
};

export function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuthSignInWithEmailAndPassword(auth, {
    onSuccess() {
      navigate(redirect || '/');
    },
  });

  const [params] = useSearchParams();
  const redirect = params.get('redirect');

  // Set up formik for login.
  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate(values) {
      const errors: FormikErrors<FormValues> = {};
      if (!values.email) errors.email = 'Please provide an email address.';
      if (!values.password) errors.password = 'Please provide a password.';
      return errors;
    },
    async onSubmit(values) {
      signIn.mutate({
        email: values.email,
        password: values.password,
      });
    },
  });

  return (
    <section className="max-w-xl mx-auto my-20 px-4">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900">Sign in to your account</h1>
      <p className="text-center mb-4 italic text-gray-600">
        New to Kara&apos;s Coffee?&nbsp;
        <Link to="/register" className="text-indigo-700 hover:underline">
          Create an account
        </Link>
        .
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
          <Input
            type="password"
            id="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.dirty ? formik.errors.password : undefined}
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-indigo-600 text-sm font-medium tracking-wide hover:underline">
              Forgot your password?
            </Link>
          </div>
          {signIn.isError && <Error>{signIn.error.message}</Error>}
          <Button disabled={!formik.isValid} loading={signIn.isLoading} type="submit">
            Sign in
          </Button>
        </form>
        <Divider>Or register with</Divider>
        <div className="mt-6">
          <SocialProviders redirect={redirect} />
        </div>
        <div className="mt-4 text-sm">
          <p>
            By registering an account, you agree to the{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline">
              Terms of Service
            </a>
            . Google&rsquo;s{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline">
              Privacy Policy
            </a>{' '}
            applies to your use of this site. The account you register is temporary as the data for this application is
            reset every 24 hours.
          </p>
        </div>
      </Card>
    </section>
  );
}
