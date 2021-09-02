import { sendPasswordResetEmail, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { FormikErrors, useFormik } from 'formik';
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input, Error, Divider } from '../components/Form';
import { SocialProviders } from '../components/SocialProviders';
import { auth } from '../firebase';
import { signInWithGitHub, signInWithGoogle } from '../firebase/auth';

type FormValues = {
  email: string;
};

export function ForgotPassword() {
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
    async onSubmit(values, helpers) {
      try {
        console.log('Submitting form with values: ', values);
        await sendPasswordResetEmail(auth, values.email);
      } catch (e) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        helpers.setStatus(e.message);
      }
    },
  });

  return (
    <section className="max-w-xl mx-auto my-20">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900">Forgot Password</h1>
      <p className="text-center mb-4 italic text-gray-600">
        Enter your email address, we'll send a recovery link to your inbox. .
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
          {!!formik.status && <Error>{formik.status}</Error>}
          <button
            disabled={!formik.isValid}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send Email
          </button>
        </form>
      </Card>
    </section>
  );
}
