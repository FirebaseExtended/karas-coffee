import React from 'react';
import cx from 'classnames';

export type ButtonGroupProps<T extends string> = {
  active: T;
  onClick: (id: T) => void;
  buttons: {
    id: T;
    children: React.ReactNode;
  }[];
};

export function ButtonGroup<T extends string>({ active, onClick, buttons }: ButtonGroupProps<T>) {
  return (
    <div className="inline-flex text-sm">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => onClick(button.id)}
          className={cx(
            'px-4 py-1 first:rounded-bl first:rounded-tl border-l last:rounded-br last:rounded-tr last:border-r bg-gray-50 hover:bg-gray-100 border-t border-b font-bold',
            {
              'text-indigo-700': active == button.id,
              'text-gray-400 hover:text-gray-700': active !== button.id,
            },
          )}
        >
          {button.children}
        </button>
      ))}
    </div>
  );
}
