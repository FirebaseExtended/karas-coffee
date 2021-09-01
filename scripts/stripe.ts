import Stripe from 'stripe';

import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Firebase firestore-stripe-subscriptions',
    version: '0.1.15',
  },
});
