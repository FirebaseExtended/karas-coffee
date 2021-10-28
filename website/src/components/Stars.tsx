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

import React, { useState } from 'react';
import cx from 'classnames';
import { StarIcon } from '@heroicons/react/outline';

import { emptyArray } from '../utils';

type StarSize = 'base' | 'lg';

export type StarsProps = {
  max: number;
  size?: StarSize;
  current?: number;
  onSelect?: (value: number) => void;
};

const sizeMap: { [key in StarSize]: string } = {
  base: 'w-4 h-4',
  lg: 'w-6 h-6',
};

export function Stars({ max, current = 0, size = 'base', onSelect }: StarsProps) {
  const [selection, setSelection] = useState<number>(0);

  return (
    <div className="flex items-center">
      {emptyArray(max).map((_, i) => {
        return (
          <StarIcon
            key={i}
            role={onSelect ? 'button' : 'none'}
            fill="currentColor"
            onMouseOver={() => setSelection(i + 1)}
            onMouseOut={() => setSelection(0)}
            onClick={() => {
              const value = i + 1;
              setSelection(value);
              onSelect?.(value);
            }}
            className={cx('text-yellow-300', sizeMap[size], {
              'opacity-25': i > current - 1 || (!!onSelect && selection > 0 && i >= selection),
              '!text-yellow-400 opacity-100': !!onSelect && selection > 0 && i < selection,
            })}
          />
        );
      })}
    </div>
  );
}
