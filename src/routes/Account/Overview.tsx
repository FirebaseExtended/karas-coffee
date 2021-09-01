import React from 'react';
import { useSignOut } from '../../hooks/useSignOut';

export function Overview() {
  const signOut = useSignOut();

  return (
    <div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
