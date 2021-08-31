import React from 'react';

export function Header() {
  return (
    <header>
      <div className="mx-auto max-w-8xl px-6 h-12 flex items-center">
        <div>
          Kara's Coffee
        </div>
        <div className="flex-grow"></div>
        <div>
          Account
        </div>
      </div>
    </header>
  );
}
