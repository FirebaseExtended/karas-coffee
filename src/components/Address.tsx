import { FormikConfig, useFormik } from 'formik';
import React from 'react';
import { Input } from './Form';

export type AddressFormValues = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
};

type AddressProps = {
  values: AddressFormValues;
  errors?: { [key in keyof AddressFormValues]?: string | undefined };
  onChange: (e: React.ChangeEvent<any>) => void;
};

export function Address({ values, errors, onChange }: AddressProps) {
  return (
    <div className="space-y-2">
      <Input id="name" value={values.name} onChange={onChange} placeholder="Name" error={errors?.name} />
      <div className="grid grid-cols-2 gap-x-2">
        <Input id="line1" value={values.line1} onChange={onChange} placeholder="Address Line 1" error={errors?.line1} />
        <Input id="line2" value={values.line2} onChange={onChange} placeholder="Address Line 2" error={errors?.line2} />
      </div>
      <div className="grid grid-cols-3 gap-x-2">
        <Input id="city" value={values.city} onChange={onChange} placeholder="City" error={errors?.city} />
        <Input id="state" value={values.state} onChange={onChange} placeholder="State / Region" error={errors?.state} />
        <Input
          id="postal_code"
          value={values.postal_code}
          onChange={onChange}
          placeholder="Zip / Postal Code"
          error={errors?.postal_code}
        />
      </div>
    </div>
  );
}
