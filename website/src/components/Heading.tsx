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

export type HeadingProps = {
  children: React.ReactNode;
  actions?: React.ReactNode[];
};

export function Heading({ children, actions }: HeadingProps) {
  return (
    <div className="flex items-center my-8 text-gray-800">
      <h2 className="flex-grow text-3xl font-extrabold tracking-wide">{children}</h2>
      {!!actions && <div className="flex items-center space-x-4">{actions}</div>}
    </div>
  );
}
