import React, { FocusEventHandler, useEffect, useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, connectStateResults, connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided, Hit } from 'react-instantsearch-core';
import { Link, useNavigate } from 'react-router-dom';

const CLIENT = algoliasearch('Z7DKWT901V', 'c529b90d287423b1f926506fb74307ff');

export function Search() {
  const [focussed, setFocussed] = useState<boolean>(false);

  return (
    <div className="relative w-[500px]">
      <InstantSearch searchClient={CLIENT} indexName="products">
        <SearchBox
          onFocus={() => setFocussed(true)}
          onBlur={() => {
            // Allow the link event to fire before triggering the blur event
            // TODO(ehesp): Bit hacky but works for now
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
      className="w-[500px] p-2 border rounded focus:border-gray-500 focus:outline-none"
      placeholder="Search coffee & swag..."
      type="search"
      value={state.currentRefinement}
      onChange={(event) => state.refine(event.currentTarget.value)}
    />
  );
});

const Results = connectStateResults((state) => {
  const wrapper = (children: React.ReactElement) => (
    <div className="absolute z-10 mt-2 border bg-white rounded shadow-xl w-[600px] transform translate-x-[-50%] left-[50%]">
      {children}
    </div>
  );

  if (state.searchResults?.nbHits > 0) {
    return wrapper(<>{state.children}</>);
  }

  return wrapper(
    <div className="p-20 flex items-center justify-center text-gray-600">Sorry, no results were found</div>,
  );
});

const Row = ({ hit }: { hit: Hit }) => {
  console.log(hit);
  return (
    <Link
      to={`/product/${hit.objectID}`}
      className="flex px-4 py-4 hover:bg-gray-50"
      onClick={(e) => e.stopPropagation()}
    >
      {hit.name}
    </Link>
  );
};
