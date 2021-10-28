/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import cx from 'classnames';
import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export function AccountOutlet() {
  const [params] = useSearchParams();
  const { clearCart } = useCart();

  const completed = params.get('complete') === 'true';

  useEffect(() => {
    if (completed) {
      clearCart();
    }
  }, [completed]);

  return (
    <section className="px-4 lg:px-0">
      <nav className="mb-8">
        <Menu
          items={[
            { to: '/account', label: 'Account' },
            { to: '/account/subscription', label: 'Subscription' },
            { to: '/account/orders', label: 'Orders' },
          ]}
        />
      </nav>
      <div>
        <Outlet />
      </div>
    </section>
  );
}

type MenuProps = {
  items: {
    to: string;
    label: string;
  }[];
};

function Menu({ items }: MenuProps) {
  return (
    <ul className="flex space-x-1">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            end
            to={item.to}
            className={({ isActive }) =>
              cx('px-2 py-2 border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900', {
                'border-indigo-500 text-gray-900': isActive,
              })
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
