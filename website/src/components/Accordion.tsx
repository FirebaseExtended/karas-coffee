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
import { ChevronRightIcon } from '@heroicons/react/outline';
import cx from 'classnames';

export type AccordionProps = {
  children: React.ReactNode | React.ReactNode[];
};

export function Accordion({ children }: AccordionProps) {
  return <div className="border rounded divide-y">{children}</div>;
}

export type AccordionItemProps = {
  // If true, the contents of the accordion item will be displayed.
  isOpen: boolean;
  // A function called to trigger the open state of the accordion.
  onToggle: () => void;
  // The visible content of the accordion item.
  children: React.ReactNode;
  // The hidden content of the accordion item, which will be shown when opened.
  collapsible: React.ReactNode;
};

export function AccordionItem({ isOpen, onToggle, children, collapsible }: AccordionItemProps) {
  return (
    <div>
      <div className="flex items-center space-x-4 p-6">
        <button onClick={onToggle} className="p-2">
          <ChevronRightIcon
            className={cx('w-5 h-5 transform transition-transform', {
              'rotate-90': isOpen,
            })}
          />
        </button>
        <div className="flex-grow">{children}</div>
      </div>
      {isOpen && <div className="bg-gray-50 p-6">{collapsible}</div>}
    </div>
  );
}
