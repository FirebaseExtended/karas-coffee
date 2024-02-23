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

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVectorSearch } from '../hooks/useVectorSearch';
import { Product } from '../types';
import { query as firestoreQuery, where, limit } from 'firebase/firestore';
import { collections } from '../firebase';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';

export function VectorSearch() {
  const [searchTerm, setSearchTerm] = useState('mug');

  const [focussed, setFocussed] = useState<boolean>(false);

  const { isLoading, isError, error, data } = useVectorSearch(searchTerm, 3);

  const handleSearchChange = (searchTerm: any) => {
    setSearchTerm(searchTerm);
  };

  const ids = data?.ids || ['amazing-mug-black'];

  const results = useFirestoreQueryData(
    ['recommendations', ids],
    firestoreQuery(collections.products, where('id', 'in', ids)),
    {},
    {
      enabled: !isLoading && !isError && !!ids && ids.length > 1, // Ensure the query is only run when ids are available
    },
  );

  return (
    <div className="relative w-full max-w-[500px]">
      <input
        onFocus={() => setFocussed(true)}
        onBlur={() => {
          // Allow the link event to fire before triggering the blur event
          setTimeout(() => {
            setFocussed(false);
          }, 100);
        }}
        className="w-full max-w-[500px] p-2 border rounded focus:border-gray-500 focus:outline-none"
        placeholder="Search coffee & swag..."
        type="search"
        onChange={(event) => handleSearchChange(event.currentTarget.value)}
      />
      {focussed && (
        <div className="absolute z-10 mt-4 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
          {results.data?.map((product: Product) => (
            <Row key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}

const Results = (results: any) => {
  const wrapper = (children: React.ReactElement) => (
    <div className="absolute z-10 mt-4 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
      {children}
    </div>
  );

  if (results.length > 0) {
    return wrapper(<>{results.children}</>);
  }

  return wrapper(
    <div className="flex items-center justify-center p-20 text-gray-600">Sorry, no results were found</div>,
  );
};

const Row = (product: Product) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="flex items-center px-4 py-4 hover:bg-gray-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-shrink-0 w-16 mr-4">
        <img src={product.images[0]} alt={product.name} className="object-cover w-16 h-16 rounded" />
      </div>
      <div>
        <div className="flex items-center text-lg font-semibold">
          <h3 className="flex-grow">{product.name}</h3>
          <div>${product.metadata.price_usd}</div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{product.description}</p>
      </div>
    </Link>
  );
};
