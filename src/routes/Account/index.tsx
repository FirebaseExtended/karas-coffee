import React from 'react';
import { signOut } from '../../firebase/auth';

export function Account() {
  return (
    <section className="max-w-3xl mx-auto">
      <nav>
        <ul className="flex space-x-3">
          <li>Account</li>
          <li>Subscription</li>
          <li>Orders</li>
        </ul>
      </nav>
      <hr />
      <div>
        <button onClick={signOut}>Sign Out</button><br />
        <button onClick={() => null}>Delete Account</button>
      </div>
    </section>
  );
}
