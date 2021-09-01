import React, { useEffect, useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, connectStateResults, connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided, Hit } from 'react-instantsearch-core';
import { Link, useNavigate } from 'react-router-dom';

const CLIENT = algoliasearch('Z7DKWT901V', 'c529b90d287423b1f926506fb74307ff');

export function Search() {
  const input = useRef<HTMLInputElement>(null);
  const [focussed, setFocussed] = useState<boolean>(false);

  useEffect(() => {
    if (input.current) {
      input.current.onfocus = function () {
        setFocussed(true);
      };
      input.current.onblur = function () {
        setFocussed(false);
      };
      input.current.className = 'w-full px-2 py-2 border rounded focus:outline-none focus:border-gray-800';
    }
  }, [input]);

  return (
    <div className="relative w-[500px]">
      <InstantSearch searchClient={CLIENT} indexName="products">
        <SearchBox onFocus={() => setFocussed(true)} onBlur={() => setFocussed(false)} />
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
    <div className="absolute mt-2 border bg-white rounded shadow-xl w-[600px] transform translate-x-[-50%] left-[50%]">
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
    <Link to={`/product/${hit.objectID}`} className="flex px-4 py-4 hover:bg-gray-50">
      {hit.name}
    </Link>
  );
};
