import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../firebase/auth';
import { useUser } from '../hooks/useUser';

export function Header() {
  const user = useUser();

  return (
    <header>
      <div className="mx-auto max-w-8xl px-6 h-12 flex items-center">
        <div>Kara's Coffee</div>
        <div className="flex-grow"></div>
        <div>
          {!!user && <button onClick={signOut}>Sign Out</button>}
          {!user && <Link to="/login">Login</Link>}
        </div>
      </div>
    </header>
  );
}
