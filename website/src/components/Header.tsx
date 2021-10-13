import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Cart } from './Cart';
import { Search } from './Search';

export function Header() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-filter backdrop-blur-sm">
      <div className="flex items-center h-20 mx-auto max-w-7xl px-6 space-x-4">
        <div className="flex-grow lg:flex-shrink-0 lg:flex-grow-0">
          <h3
            className="lg:text-2xl font-bold tracking-wide"
            style={{ fontFamily: "'Annie Use Your Telescope', cursive" }}
          >
            <Link to="/" className="hover:underline">
              Kara&apos;s Coffee
            </Link>
          </h3>
          <p className="hidden lg:block -mt-1 text-xs text-gray-500">Not so real coffee and swag</p>
        </div>
        <div className="hidden lg:flex items-center justify-center flex-grow">
          <Search />
        </div>
        <div className="flex flex-shrink-0 space-x-4">
          <Cart />
          <HeaderLink to="/shop">Shop</HeaderLink>
          <HeaderLink to={user.isSuccess && !!user.data ? '/account' : '/signin'}>
            {user.isSuccess && !!user.data && (
              <>
                <span>My Account</span>
                {!!user.data?.photoURL && <img src={user.data?.photoURL} className="ml-2 rounded-full w-7 h-7" />}
              </>
            )}
            {user.isSuccess && !user.data && 'Sign In'}
          </HeaderLink>
        </div>
      </div>
    </header>
  );
}

type HeaderLinkProps = {
  to: string;
  children: React.ReactNode;
};

function HeaderLink({ to, children }: HeaderLinkProps) {
  return (
    <Link to={to} className="flex items-center font-semibold text-gray-600 hover:text-gray-900">
      {children}
    </Link>
  );
}
