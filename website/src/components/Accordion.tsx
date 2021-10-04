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
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
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
