import React from 'react';

export type HeadingProps = {
  children: React.ReactNode;
  actions?: React.ReactNode[];
};

export function Heading({ children, actions }: HeadingProps) {
  return (
    <div className="flex items-center my-8">
      <h2 className="flex-grow text-3xl font-extrabold tracking-wide">{children}</h2>
      {!!actions && <div className="flex items-center space-x-4">{actions}</div>}
    </div>
  );
}
