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

import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { TrashIcon, ExclamationIcon } from '@heroicons/react/outline';

import { AddressForm, AddressFormValues } from './AddressForm';
import { useAddAddress, useAddresses, useDeleteAddress } from '../hooks/useAddresses';
import { FormikErrors, useFormik } from 'formik';
import { Button } from './Button';
import { Address } from '../types';
import { Spinner } from './Spinner';
import { Alert } from './Alert';

type OnAddressSelect = (address: Address) => void;

type AddressBookProps = {
  onSelect: OnAddressSelect;
  selectedAddressId?: string;
};

const fixedAddresses: { [key: string]: AddressFormValues } = {
  address1: {
    name: 'Coffee Drinker',
    line1: '1600 Amphitheatre Parkway',
    line2: '',
    city: 'Mountain View',
    state: 'CA',
    postal_code: '94043',
  },
  address2: {
    name: 'Coffee Drinker',
    line1: '111 8th Avenue',
    line2: '',
    city: 'New York',
    state: 'NY',
    postal_code: '10011',
  },
  address3: {
    name: 'Coffee Drinker',
    line1: '601 N 34th Street',
    line2: '',
    city: 'Seattle',
    state: 'WA',
    postal_code: '98103',
  },
};

export function AddressBook({ onSelect, selectedAddressId }: AddressBookProps) {
  const [fixed, setFixed] = useState<string>('address1');
  const addresses = useAddresses();

  if (!addresses.isSuccess) {
    return <div />;
  }

  return (
    <div className="bg-gray-50 p-6 rounded border px-6">
      <Alert type="warning">For this demo application, please use one of the predefined addresses.</Alert>
      <div className="flex items-center mb-4">
        <h3 className="flex-grow text-xl font-bold text-gray-800">Enter a new shipping address:</h3>
        <select
          name="address"
          id="address"
          className="px-3 py-1 border rounded"
          onChange={(e) => setFixed(e.target.value)}
        >
          <option value="address1">Address 1</option>
          <option value="address2">Address 2</option>
          <option value="address3">Address 3</option>
        </select>
      </div>
      <div className="mb-4">
        <AddressEntry addressKey={fixed} />
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

function AddressEntry({ addressKey }: { addressKey: string }) {
  const add = useAddAddress();

  const formik = useFormik<AddressFormValues>({
    initialValues: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
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

  useEffect(() => {
    formik.setValues(fixedAddresses[addressKey]);
  }, [addressKey]);

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
