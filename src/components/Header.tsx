import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Cart } from './Cart';
import { Search } from './Search';

export function Header() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-filter backdrop-blur-sm">
      <div className="flex items-center h-20 mx-auto max-w-7xl md:px-6">
        <div>
          <h3 className="text-xl font-bold tracking-wide">
            <Link to="/" className="hover:underline">
              Kara's Coffee
            </Link>
          </h3>
          <p className="-mt-1 text-xs italic text-gray-500">Not so real coffee and swag</p>
        </div>
        <div className="flex items-center justify-center flex-grow">
          <Search />
        </div>
        <div className="flex space-x-4">
          <Cart />
          <Link to={!!user ? '/account' : '/signin'} className="font-semibold text-gray-600 hover:text-gray-900">
            My Account
          </Link>
        </div>
      </div>
    </header>
  );
}
