import { useFormik } from 'formik';
import React from 'react';
import { Input } from './Form';

type FormValues = {
  name: string;
  line1: string;
  line2: string;
  state: string;
  zip: string;
};

type AddressProps = {
  onSubmit: (values: FormValues) => void;
};

export function Address({ onSubmit }: AddressProps) {
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      line1: '',
      line2: '',
      state: '',
      zip: '',
    },
    async validate() {
      // TODO(ehesp): Address validation
    },
    onSubmit,
  });

  return (
    <div className="space-y-2">
      <Input id="name" value={formik.values.name} onChange={formik.handleChange} placeholder="Name" />
      <div className="grid grid-cols-2 gap-x-2">
        <Input id="name" value={formik.values.name} onChange={formik.handleChange} placeholder="Address Line 1" />
        <Input id="name" value={formik.values.name} onChange={formik.handleChange} placeholder="Address Line 2" />
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <Input id="name" value={formik.values.name} onChange={formik.handleChange} placeholder="State / Region" />
        <Input id="name" value={formik.values.name} onChange={formik.handleChange} placeholder="Zip / Postal Code" />
      </div>
    </div>
  );
}
