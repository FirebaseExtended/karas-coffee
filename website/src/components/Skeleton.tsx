import React from 'react';
import cx from 'classnames';

export type SkeletonProps = React.HTMLProps<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return <div aria-label="Skeleton" className={cx('bg-gray-100 animate-pulse rounded', className)} {...props} />;
}
