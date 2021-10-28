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

import React from 'react';
import cx from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/solid';

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

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
}

export function Input({ id, label, value, onChange, error, ...props }: InputProps) {
  return (
    <div>
      {!!label && <Label id={id}>{label}</Label>}
      <input
        {...props}
        id={id}
        name={id}
        value={value}
        className={cx('bg-white w-full px-2 py-1 border rounded focus:outline-none', {
          'focus:border-gray-500': !error,
          'border-red-500': !!error,
          'opacity-50': props.disabled,
        })}
        onChange={onChange}
      />
      {!!error && <Error>{error}</Error>}
    </div>
  );
}

export interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  error?: string;
}

export function Select({ id, label, value, options, onChange, error }: SelectProps) {
  return (
    <div>
      {!!label && <Label id={id}>{label}</Label>}
      <div className="relative w-42">
        <select
          value={value}
          onChange={onChange}
          name="order"
          id="order"
          className="w-full truncate border text-sm text-indigo-700 font-bold px-4 py-1 pr-8 rounded bg-gray-50 hover:bg-gray-100 appearance-none focus:outline-none focus:border-gray-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="w-5 h-5 text-indigo-700 absolute top-[6px] right-2" />
      </div>
      {!!error && <Error>{error}</Error>}
    </div>
  );
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  value: string | number;
  rows: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  error?: string;
}

export function TextArea({ id, label, value, onChange, error, ...props }: TextAreaProps) {
  return (
    <div>
      {!!label && <Label id={id}>{label}</Label>}
      <textarea
        {...props}
        id={id}
        name={id}
        value={value}
        className={cx('bg-white w-full px-2 py-1 border rounded focus:outline-none', {
          'focus:border-gray-500': !error,
          'border-red-500': !!error,
        })}
        onChange={onChange}
      />
      {!!error && <Error>{error}</Error>}
    </div>
  );
}

export function Label({ id, children }: { id: string; children: string }) {
  return (
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {children}
    </label>
  );
}

export function Error({ children }: { children: string }) {
  return <p className="mt-2 text-xs text-red-500">{children}</p>;
}
