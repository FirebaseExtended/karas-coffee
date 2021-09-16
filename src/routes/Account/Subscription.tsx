import React from 'react';

import { useSubscriptions } from '../../hooks/useSubscriptions';
import { useSubscription } from '../../hooks/useSubscription';

export function Subscription() {
  const subscription = useSubscription('sub_1JaJu4DPaZ24HcpvIg4DDGiL');

  if (!subscription.data) return <div>loading...</div>;

  if (!subscription.data[0]) return <div>Not subsribed</div>;

  return <div>Subscribed to {subscription.data[0].items[0].plan.product}</div>;
}
