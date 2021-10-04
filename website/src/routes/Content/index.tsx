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
