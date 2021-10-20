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
  selectedAddressId?: string;
};

export function AddressBook({ onSelect, selectedAddressId }: AddressBookProps) {
  const addresses = useAddresses();

  if (!addresses.isSuccess) {
    return <div />;
  }

  return (
    <div className="bg-gray-50 p-6 rounded border px-6">
      <h3 className="mb-4 text-xl font-bold text-gray-800">Enter a new shipping address:</h3>
      <div className="mb-4">
        <AddressEntry />
      </div>
      <hr />
      <h3 className="my-4 text-xl font-bold text-gray-800">Select an existing address:</h3>
      {addresses.data.length === 0 && (
        <p className="text-sm my-4 text-gray-500 border-none">No existing addresses saved.</p>
      )}
      {addresses.data.length > 0 && (
        <div className="max-h-72 overflow-x-scroll pr-6">
          {addresses.data.map((address) => (
            <AddressSelection
              isSelected={address.id == selectedAddressId}
              key={address.id}
              address={address}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
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
          name: values.name,
          addressLine1: values.line1,
          addressLine2: values.line2,
          cityLocality: values.city,
          stateProvince: values.state,
          postalCode: values.postal_code,
          countryCode: 'US',
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

function AddressSelection({
  address,
  onSelect,
  isSelected,
}: {
  address: Address;
  isSelected: boolean;
  onSelect: OnAddressSelect;
}) {
  const remove = useDeleteAddress(address.id);

  const isPending = !address.validation;
  const isValid = address.validation?.status === 'verified' || address.validation?.status === 'warning';
  const isSelectable = !isPending && isValid && !isSelected;

  return (
    <div
      role={isSelectable ? 'button' : undefined}
      onClick={() => {
        if (isSelectable) {
          onSelect(address);
        }
      }}
      className={cx('flex border bg-white rounded p-6 mb-4', {
        'hover:bg-indigo-50': isSelectable,
        'cursor-not-allowed	': !isSelectable,
        'border-indigo-500 shadow-inner	': isSelected,
      })}
    >
      <div className="flex-grow text-gray-800">
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
