import React from 'react';

import { useSubscriptions } from '../../hooks/useSubscriptions';
import { useSubscription } from '../../hooks/useSubscription';

export function Subscription() {
  const subscription = useSubscription();

  if (subscription.isSuccess) {
    return <div>{subscription.data ? 'Subscribed' : 'Not Subscribed'}</div>;
  }

  return null;
}
