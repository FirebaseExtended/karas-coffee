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

type AlertType = 'success' | 'warning' | 'danger';

export type AlertProps = {
  type: AlertType;
  children: React.ReactNode;
};

const classNameMap: { [key in AlertType]: string } = {
  success: 'bg-green-500/10 border-green-500/20 text-green-500',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
  danger: 'bg-red-500/10 border-red-500/20 text-red-500',
};

export function Alert({ type, children }: AlertProps) {
  return <div className={cx('mb-8 border text-sm rounded px-4 py-2 text-center', classNameMap[type])}>{children}</div>;
}
