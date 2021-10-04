import React from 'react';
import cx from 'classnames';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, disabled, onClick, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!loading && !disabled) {
          onClick && onClick(e);
        }
      }}
      className={cx(
        'relative w-full flex justify-center py-1 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600',
        {
          'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500':
            !disabled && !loading,
          'opacity-75': disabled || loading,
          'cursor-not-allowed': disabled,
          'cursor-wait': loading,
        },
      )}
    >
      <span
        className={cx({
          'opacity-0': loading,
        })}
      >
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </button>
  );
}
