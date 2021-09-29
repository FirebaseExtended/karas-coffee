import React from 'react';
import cx from 'classnames';
import { NavLink, Outlet } from 'react-router-dom';

export function AccountOutlet() {
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
