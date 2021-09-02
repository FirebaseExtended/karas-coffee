import React from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FormikErrors, useFormik } from 'formik';
import { Card } from '../components/Card';
import { Input, Error } from '../components/Form';
import { auth } from '../firebase';

type FormValues = {
  email: string;
};

type FormikStatus =
  | {
      type: 'error' | 'success';
      message: string;
    }
  | undefined;

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
      let status: FormikStatus;

      try {
        console.log('Submitting form with values: ', values);
        await sendPasswordResetEmail(auth, values.email);
        status = {
          type: 'success',
          message: `A password reset email has been sent to ${values.email}.`,
        };
      } catch (e) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        status = {
          type: 'error',
          message: e.message,
        };
      }

      helpers.setStatus(status);
    },
  });

  const status = formik.status as FormikStatus;

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
          {status?.type === 'error' && <Error>{status.message}</Error>}
          {status?.type === 'success' && <p>{status.message}</p>}
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
