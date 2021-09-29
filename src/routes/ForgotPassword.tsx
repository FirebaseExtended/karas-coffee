import React from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FormikErrors, useFormik } from 'formik';
import { Card } from '../components/Card';
import { Input, Error } from '../components/Form';
import { auth } from '../firebase';
import { Button } from '../components/Button';

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
      } catch (e: any) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        status = {
          type: 'error',
          message: e?.message || 'Something went wrong.',
        };
      }

      helpers.setStatus(status);
    },
  });

  const status = formik.status as FormikStatus;

  return (
    <section className="max-w-xl mx-auto my-20 px-4">
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
          <Button disabled={!formik.isValid} loading={formik.isSubmitting} type="submit">
            Send Email
          </Button>
        </form>
      </Card>
    </section>
  );
}
