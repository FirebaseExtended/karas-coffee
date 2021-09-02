import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FormikErrors, useFormik } from 'formik';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input, Error, Divider } from '../components/Form';
import { SocialProviders } from '../components/SocialProviders';
import { auth } from '../firebase';

type FormValues = {
  email: string;
  password: string;
};

export function SignIn() {
  const navigate = useNavigate();
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
    async onSubmit(values, helpers) {
      try {
        console.log('Submitting form with values: ', values);
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate(redirect || '/');
      } catch (e: any) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        helpers.setStatus(e?.message || 'Something went wrong.');
      }
    },
  });

  return (
    <section className="max-w-xl mx-auto my-20">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900">Sign in to your account</h1>
      <p className="text-center mb-4 italic text-gray-600">
        New to Kara's Coffee?{' '}
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
          {!!formik.status && <Error>{formik.status}</Error>}
          <button
            disabled={!formik.isValid}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
        <Divider>Or continue with</Divider>
        <div className="mt-6">
          <SocialProviders redirect={redirect} />
        </div>
      </Card>
    </section>
  );
}
