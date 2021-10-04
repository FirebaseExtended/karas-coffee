import React from 'react';
import ReachTooltip from '@reach/tooltip';

import '@reach/tooltip/styles.css';

export type TooltipProps = {
  label: string;
  children: React.ReactNode;
};

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <ReachTooltip label={label} className="!bg-black rounded text-xs !px-2 !text-white">
      {children}
    </ReachTooltip>
  );
}
