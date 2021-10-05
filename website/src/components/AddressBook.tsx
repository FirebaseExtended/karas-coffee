import React from 'react';
import cx from 'classnames';
import { TrashIcon, ExclamationIcon } from '@heroicons/react/outline';

import { AddressForm, AddressFormValues } from './AddressForm';
import { useAddAddress, useAddresses, useDeleteAddress } from '../hooks/useAddresses';
import { FormikErrors, useFormik } from 'formik';
import { Button } from './Button';
import { Address } from '../types';
import { Spinner } from './Spinner';

type OnAddressSelect = (address: Address) => void;

type AddressBookProps = {
  onSelect: OnAddressSelect;
};

export function AddressBook({ onSelect }: AddressBookProps) {
  const addresses = useAddresses();

  if (!addresses.isSuccess) {
    return <div />;
  }

  return (
    <div className="bg-gray-50 p-6 rounded border">
      <h3 className="mb-4 text-xl font-bold">Enter a shipping address</h3>
      <div className="mb-4">
        <AddressEntry />
      </div>
      <h3 className="mb-4 text-xl font-bold">Select an address</h3>
      {addresses.data.length === 0 && <p>No addresses saved.</p>}
      <div className="space-y-4">
        {addresses.data.map((address) => (
          <AddressSelection key={address.id} address={address} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function AddressEntry() {
  const add = useAddAddress();

  const formik = useFormik<AddressFormValues>({
    initialValues: {
      name: 'Coffee Drinker',
      line1: '1600 Amphitheatre Parkway',
      line2: '',
      city: 'Mountain View',
      state: 'CA',
      postal_code: '94043',
    },
    validate(values) {
      const e: FormikErrors<AddressFormValues> = {};
      if (!values.name) e.name = 'A name is required';
      return e;
    },
    async onSubmit(values) {
      add.mutate({
        address: {
          addressLine1: values.line1,
          addressLine2: values.line2,
          cityLocality: values.city,
          name: values.name,
          stateProvince: values.state,
          postalCode: values.postal_code,
          countryCode: values.postal_code,
        },
      });
    },
  });

  return (
    <>
      <AddressForm values={formik.values} onChange={formik.handleChange} errors={formik.errors} />
      <div className="mt-2">
        <Button onClick={formik.submitForm} loading={add.isLoading}>
          Save Address
        </Button>
      </div>
      {add.isError && <p className="mt-2 text-red-500 text-xs">{add.error.message}</p>}
    </>
  );
}

function AddressSelection({ address, onSelect }: { address: Address; onSelect: OnAddressSelect }) {
  const remove = useDeleteAddress(address.id);

  const isPending = !address.validation;
  const isValid = address.validation?.status === 'verified' || address.validation?.status === 'warning';
  const isSelectable = !isPending && isValid;

  return (
    <div
      role={isSelectable ? 'button' : undefined}
      onClick={() => {
        if (isSelectable) {
          onSelect(address);
        }
      }}
      className={cx('flex border bg-white rounded p-6', {
        'hover:bg-gray-100': isSelectable,
        'cursor-not-allowed	': !isSelectable,
      })}
    >
      <div className="flex-grow">
        <div className="font-bold">{address.address.name}</div>
        <div>{address.address.addressLine1}</div>
        <div>{address.address.addressLine2}</div>
        <div>{address.address.cityLocality}</div>
        <div>
          {address.address.stateProvince}, {address.address.countryCode}
        </div>
        {isPending && (
          <div className="flex items-center space-x-2 bg-yellow-500/10 p-2 rounded border border-yellow-500 text-yellow-500 text-xs mt-4">
            <Spinner size="sm" />
            <div>Address is being validated...</div>
          </div>
        )}
        {!isPending && !isValid && (
          <div className="flex items-center space-x-2 bg-red-500/10 p-2 rounded border border-red-500 text-red-500 text-xs mt-4">
            <ExclamationIcon className="w-5 h-5" />
            <div>Address could not be validated.</div>
          </div>
        )}
      </div>
      <div
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          remove.mutate();
        }}
        className="hover:opacity-75 w-5 h-5"
      >
        <TrashIcon className="w-5 h-5 text-red-500" />
      </div>
    </div>
  );
}
