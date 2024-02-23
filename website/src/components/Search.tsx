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

import React, { useState, useCallback, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, useHits, useSearchBox, Hits, Configure } from 'react-instantsearch';
import { useVectorSearch as useCustomSearch } from '../hooks/useVectorSearch';
import { Switch } from './Switch';
import { Hit } from 'react-instantsearch-core';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';
import { query as firestoreQuery, where } from 'firebase/firestore';
import { collections } from '../firebase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
const searchClient = algoliasearch('Z7DKWT901V', 'c529b90d287423b1f926506fb74307ff');

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [conciergeEnabled, setConciergeEnabled] = useState(false);

  const [focussed, setFocussed] = useState<boolean>(false);

  const handleQueryChange = (query: string) => setQuery(query);

  const handleSwitch = (isOn: boolean) => {
    setConciergeEnabled(isOn);
  };

  return (
    <div
      className={`relative w-full max-w-[800px]  border rounded ${focussed ? 'border-gray-500' : ''} grid grid-cols-4`}
    >
      <InstantSearch searchClient={searchClient} indexName="products">
        <SearchInput
          handleQueryChange={handleQueryChange}
          placeholder={conciergeEnabled ? 'Search...' : 'Search...'}
          onFocus={() => setFocussed(true)}
          onBlur={() => {
            // Allow the link event to fire before triggering the blur event
            setTimeout(() => {
              setFocussed(false);
            }, 100);
          }}
        />
        {focussed && (
          <>{!conciergeEnabled ? <AlgoliaSearchComponent query={query} /> : <CustomSearchComponent query={query} />}</>
        )}
        <div className="p-2 items-center justify-center flex right-0 pr-4 absolute t-4 h-full">
          <Switch onChange={handleSwitch} />
        </div>
      </InstantSearch>
    </div>
  );
};

const SearchInput = ({ onSearch, placeholder, handleQueryChange, onFocus, onBlur }: any) => {
  const { query, refine } = useSearchBox();

  const handleChange = (e: any) => {
    const newQuery = e.target.value;
    refine(newQuery);
    handleQueryChange(newQuery);
  };

  const [inputValue, setInputValue] = useState(query);

  // Effect to synchronize Algolia's query state with local input state
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className="relative col-span-3 p-2 pl-4 focus:outline-none"
    />
  );
};

const CustomSearchComponent = ({ query }: { query: string }) => {
  // change the debounce time according to your needs
  const debouncedQuery = useDebounce(query, 1000);

  const results = useCustomSearch(debouncedQuery, 3);

  if (results.isLoading) return <div>Loading...</div>;
  if (results.isError) return <div>Error: {results.error.message}</div>;
  const hits = results.data;

  return (
    <div>
      {/* Adjusted for positioning of search results */}
      {hits && hits.length > 0 ? (
        <div className="absolute z-10 mt-16 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
          {hits.map((hit) => (
            <Row key={hit.id} hit={hit} />
          ))}
        </div>
      ) : (
        <div className="absolute z-10 mt-16 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
          <div className="flex items-center justify-center p-20 text-gray-600">Sorry, no results were found.</div>
        </div>
      )}
    </div>
  );
};

const AlgoliaSearchComponent = ({ query }: { query: string }) => {
  const { hits } = useHits<any>();

  // Ensure Configure is outside the conditional rendering to always apply the query configuration
  return (
    <>
      <Configure query={query} hitsPerPage={3} />
      {/* Adjusted for positioning of search results */}
      {hits && hits.length > 0 ? (
        <div className="absolute z-10 mt-16 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
          {hits.map((hit) => (
            <Row key={hit.objectID} hit={hit} />
          ))}
        </div>
      ) : (
        <div className="absolute z-10 mt-16 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
          <div className="flex items-center justify-center p-20 text-gray-600">Sorry, no results were found.</div>
        </div>
      )}
    </>
  );
};

const Row = ({ hit }: { hit: Hit<Product> | Product }) => {
  const imageUrl = hit.images && hit.images.length > 0 ? hit.images[0] : 'defaultImageURL'; // Provide a default image URL or logic here
  return hit.metadata ? (
    <Link
      to={`/product/${hit.id}`}
      className="flex items-center px-4 py-4 hover:bg-gray-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-shrink-0 w-16 mr-4">
        <img src={imageUrl} alt={hit.name} className="object-cover w-16 h-16 rounded" />
      </div>
      <div>
        <div className="flex items-center text-lg font-semibold">
          <h3 className="flex-grow">{hit.name}</h3>
          <div>{hit.metadata.price_usd}</div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{hit.description}</p>
      </div>
    </Link>
  ) : (
    <></>
  );
};
