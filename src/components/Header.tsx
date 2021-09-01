import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../firebase/auth';
import { useUser } from '../hooks/useUser';
import { Cart } from './Cart';
import { Search } from './Search';

export function Header() {
  const user = useUser();

  return (
    <header>
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center">
        <div>
          <h3 className="font-bold text-xl tracking-wide">
            <Link to="/" className="hover:underline">
              Kara's Coffee
            </Link>
          </h3>
          <p className="text-xs italic text-gray-500 -mt-1">Not so real coffee and swag</p>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <Search />
        </div>
        <div className="flex space-x-4">
          <Cart />
          <Link to={!!user ? '/account' : '/login'} className="font-semibold text-gray-600 hover:text-gray-900">
            My Account
          </Link>
        </div>
      </div>
    </header>
  );
}
