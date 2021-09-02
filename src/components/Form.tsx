import React from 'react';
import cx from 'classnames';

export type DividerProps = {
  children: string;
};

export function Divider({ children }: DividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">{children}</span>
      </div>
    </div>
  );
}

export type InputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
};

export function Input({ id, label, placeholder, value, onChange, type, error }: InputProps) {
  return (
    <div>
      {!!label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        type={type || 'text'}
        id={id}
        name={id}
        value={value}
        className={cx('bg-white w-full px-2 py-1 border rounded focus:outline-none', {
          'focus:border-gray-500': !error,
          'border-red-500': !!error,
        })}
        placeholder={placeholder}
        onChange={onChange}
      />
      {!!error && <Error>{error}</Error>}
    </div>
  );
}

export function Error({ children }: { children: string }) {
  return <p className="mt-2 text-xs text-red-500">{children}</p>;
}
