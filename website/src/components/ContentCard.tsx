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
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Content } from '../types';
import { Skeleton } from './Skeleton';

export function ContentCard({ content }: { content: Content }) {
  return (
    <div className="flex space-x-4">
      <div className="w-64 flex-shrink-0 overflow-hidden rounded shadow hover:shadow-lg">
        <Link to={`/content/${content.id}`}>
          <img
            src={content.hero}
            alt={content.title}
            className="rounded object-cover h-48 w-64 transition-all hover:scale-105"
          />
        </Link>
      </div>
      <div>
        <Link to={`/content/${content.id}`} className="hover:underline">
          <h2 className="text-lg font-bold text-gray-800">{content.title}</h2>
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
