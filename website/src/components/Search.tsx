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

import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure, connectStateResults, connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided, Hit } from 'react-instantsearch-core';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const searchClient = algoliasearch('Z7DKWT901V', 'c529b90d287423b1f926506fb74307ff');

export function Search() {
  const [focussed, setFocussed] = useState<boolean>(false);

  return (
    <div className="relative w-full max-w-[500px]">
      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure facetFilters={[['metadata.type:swag', 'metadata.type:coffee']]} />
        <SearchBox
          onFocus={() => setFocussed(true)}
          onBlur={() => {
            // Allow the link event to fire before triggering the blur event
            setTimeout(() => {
              setFocussed(false);
            }, 100);
          }}
        />
        {focussed && (
          <Results>
            <div>
              <Hits hitComponent={Row} />
            </div>
          </Results>
        )}
      </InstantSearch>
    </div>
  );
}

type SearchBoxProps = {
  onFocus: () => void;
  onBlur: () => void;
};

const SearchBox = connectSearchBox((state: SearchBoxProvided & SearchBoxProps) => {
  return (
    <input
      onFocus={state.onFocus}
      onBlur={state.onBlur}
      className="w-full max-w-[500px] p-2 border rounded focus:border-gray-500 focus:outline-none"
      placeholder="Search coffee & swag..."
      type="search"
      value={state.currentRefinement}
      onChange={(event) => state.refine(event.currentTarget.value)}
    />
  );
});

const Results = connectStateResults((state) => {
  const wrapper = (children: React.ReactElement) => (
    <div className="absolute z-10 mt-4 border bg-white rounded shadow-xl w-[600px] max-h-[400px] overflow-y-auto transform translate-x-[-50%] left-[50%]">
      {children}
    </div>
  );

  if (state.searchResults?.nbHits > 0) {
    return wrapper(<>{state.children}</>);
  }

  return wrapper(
    <div className="flex items-center justify-center p-20 text-gray-600">Sorry, no results were found</div>,
  );
});

const Row = ({ hit }: { hit: Hit<Product> }) => {
  return (
    <Link
      to={`/product/${hit.objectID}`}
      className="flex items-center px-4 py-4 hover:bg-gray-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-shrink-0 w-16 mr-4">
        <img src={hit.images[0]} alt={hit.name} className="object-cover w-16 h-16 rounded" />
      </div>
      <div>
        <div className="flex items-center text-lg font-semibold">
          <h3 className="flex-grow">{hit.name}</h3>
          <div>${hit.metadata.price_usd}</div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{hit.description}</p>
      </div>
    </Link>
  );
};
