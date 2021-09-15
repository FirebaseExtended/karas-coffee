import React from 'react';
import { Button } from '../../components/Button';
import { useSignOut } from '../../hooks/useSignOut';
import { useUser } from '../../hooks/useUser';

export function Overview() {
  const signOut = useSignOut();
  const user = useUser();

  const data = user.data!;

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="border rounded p-6">
        <h1 className="font-bold text-2xl">Your Account</h1>
        <ul className="mt-4 space-y-2 text-sm">
          <li>User ID: {data.uid}</li>
          <li>Display Name: {data.displayName}</li>
          <li>Email Address: {data.email || 'N/A'}</li>
          <li>Email Verified: {data.emailVerified ? 'Yes' : 'No'}</li>
          <li>Phone Number: {data.phoneNumber || 'N/A'}</li>
        </ul>
        <div className="mt-4">
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
