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

import React from 'react';
import { Outlet } from 'react-router-dom';
import { ContentCard, ContentCardSkeleton } from '../../components/ContentCard';
import { Heading } from '../../components/Heading';
import { useContent } from '../../hooks/useContent';
import { useSubscription } from '../../hooks/useSubscription';
import { emptyArray } from '../../utils';

export function ContentOutlet() {
  const subscription = useSubscription();

  if (subscription.isLoading) {
    return <div />;
  }

  if (!subscription.data) {
    return <div>You do not have access to this content.</div>;
  }

  return <Outlet />;
}

export function ContentList() {
  const content = useContent('content');

  const wrapper = (children: React.ReactNode[]) => (
    <section className="mt-12 max-w-3xl mx-auto px-4 lg:px-0">
      <Heading>Your daily coffee content</Heading>
      <div className="space-y-12">{children}</div>
    </section>
  );

  if (!content.isSuccess) {
    return wrapper(emptyArray(10).map((_, i) => <ContentCardSkeleton key={i} />));
  }

  return wrapper(content.data!.map((item) => <ContentCard key={item.id} content={item} />));
}
