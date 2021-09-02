import React from 'react';

export type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="bg-white border rounded py-8 px-8">{children}</div>;
}
