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

import React, { useState } from 'react';

import { useInvoices, useSubscriptions } from '../../hooks/useSubscriptions';
import { emptyArray } from '../../utils';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { Skeleton } from '../../components/Skeleton';
import { format } from 'date-fns';
import { Spinner } from '../../components/Spinner';

type OpenMap = { [key: string]: boolean };

export function Subscription() {
  const subscriptions = useSubscriptions();

  const [open, setOpen] = useState<OpenMap>({});

  function toggleOrder(subscriptionId: string) {
    setOpen((prev) => ({
      ...prev,
      [subscriptionId]: !prev[subscriptionId],
    }));
  }

  return (
    <section>
      <h1 className="font-bold text-2xl mb-6">Subscriptions</h1>
      <Accordion>
        {subscriptions.isLoading &&
          emptyArray(5).map((_, i) => (
            <div key={i} className="p-6 flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-2" />
              <div className="flex-grow">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-64 h-3 mt-2" />
              </div>
              <div>
                <Skeleton className="w-16 h-10" />
              </div>
            </div>
          ))}
        {subscriptions.isSuccess &&
          subscriptions.data.map((subscription) => (
            <AccordionItem
              key={subscription.id}
              isOpen={open[subscription.id]}
              onToggle={() => toggleOrder(subscription.id)}
              collapsible={<Invoices subscriptionId={subscription.id} />}
            >
              <div className="flex items-center">
                <div className="flex-grow">
                  <div className="font-bold">
                    {format(new Date(subscription.current_period_start.toDate()), 'do LLLL y')} -{' '}
                    {format(new Date(subscription.current_period_end.toDate()), 'do LLLL y')}
                  </div>
                </div>
                <div>
                  {subscription.status === 'active' && (
                    <div className="px-4 py-1 text-sm rounded-full bg-green-400 text-white font-semibold">Active</div>
                  )}
                  {subscription.status === 'canceled' && (
                    <div className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-white font-semibold">
                      Canceled
                    </div>
                  )}
                </div>
              </div>
            </AccordionItem>
          ))}
      </Accordion>
    </section>
  );
}

function Invoices({ subscriptionId }: { subscriptionId: string }) {
  const invoices = useInvoices(subscriptionId);

  if (!invoices.isSuccess) {
    return (
      <div className="text-gray-600 w-10 mx-auto">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {invoices.data &&
        invoices.data.map((invoice) => (
          <div className="flex items-center" key={invoice.id}>
            <div className="flex-grow font-medium">{format(new Date(invoice.created * 1000), 'do MMMM yyyy')}</div>
            <div className="flex items-center space-x-4">
              <div className="font-bold">${(invoice.amount_paid / 100).toFixed(2)}</div>
              <div>
                <a
                  href={invoice.hosted_invoice_url}
                  target="_blank"
                  className="text-indigo-600 hover:underline text-sm"
                  rel="noreferrer"
                >
                  View Invoice &rarr;
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
