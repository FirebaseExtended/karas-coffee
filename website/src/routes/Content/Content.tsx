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

import { format } from 'date-fns';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Heading } from '../../components/Heading';
import { useContentItem } from '../../hooks/useContent';

export function Content() {
  const { id } = useParams();
  const content = useContentItem(id!);

  if (!content.isSuccess) {
    return <div />;
  }

  const data = content.data!;

  return (
    <section className="mt-24 max-w-3xl mx-auto px-4 lg:px-0">
      <Link to="/content" className="hover:underline text-gray-600">
        &larr; Back to content
      </Link>
      <Heading>{data.title}</Heading>
      <div className="my-4 text-lg text-gray-600">{format(data.created_at.toDate(), 'MMMM d, yyyy')}</div>
      <img src={data.hero} alt={data.title} className="w-full rounded max-h-[400px] object-cover" />
      <div className="prose max-w-none mt-12">
        <p>{data.content}</p>
      </div>
    </section>
  );
}
