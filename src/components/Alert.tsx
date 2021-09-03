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
  return <div className={cx('mb-8 border text-sm rounded px-4 py-2', classNameMap[type])}>{children}</div>;
}
