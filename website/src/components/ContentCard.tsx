import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Content } from '../types';
import { Skeleton } from './Skeleton';

export function ContentCard({ content }: { content: Content }) {
  return (
    <div className="flex space-x-4">
      <div className="w-64 flex-shrink-0">
        <Link to={`/content/${content.id}`}>
          <img src={content.hero} alt={content.title} className="rounded object-cover h-48 w-64" />
        </Link>
      </div>
      <div>
        <Link to={`/content/${content.id}`} className="hover:underline">
          <h2 className="text-lg font-bold">{content.title}</h2>
        </Link>

        <p className="text-sm text-gray-600 mt-4">{content.excerpt}</p>
        <div className="mt-4 text-xs text-gray-600">{format(content.created_at.toDate(), 'MMM d')}</div>
      </div>
    </div>
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="flex space-x-4">
      <Skeleton className="w-64 flex-shrink-0" />
      <div className="flex-grow">
        <Skeleton className="h-8" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-2 w-3/4" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-10/12" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="mt-4 flex space-x-4">
          <Skeleton className="w-12 h-2" />
          <Skeleton className="w-12 h-2" />
        </div>
      </div>
    </div>
  );
}
