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

import { formatDistance, formatRelative } from 'date-fns';
import React from 'react';
import { TOXICITY_THRESHOLD, useProductReviewImages } from '../hooks/useReviews';
import { Review } from '../types';
import { Alert } from './Alert';
import { Skeleton } from './Skeleton';
import { Stars } from './Stars';
import { Tooltip } from './Tooltip';

export type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const images = useProductReviewImages(review.product_id, review.user.id);

  return (
    <div key={review.id}>
      {!review.attribute_scores && <Alert type="success">Your comment is currently pending review.</Alert>}
      {review.attribute_scores && review.attribute_scores.TOXICITY > TOXICITY_THRESHOLD && (
        <Alert type="danger">Your review comment has been flagged as toxic & is not public.</Alert>
      )}
      <div className="flex items-center">
        {!!review.user.photo_url && (
          <img
            src={review.user.photo_url}
            alt={review.user.display_name}
            className="w-10 h-10 rounded-full mr-4 shadow"
          />
        )}
        <div>
          <h4 className="font-bold track w-64 truncate">{review.user.display_name}</h4>
          <p className="text-sm text-gray-600">
            <Tooltip label={formatRelative(review.created_at, new Date())}>
              <span>{formatDistance(review.created_at, new Date(), { addSuffix: true })}</span>
            </Tooltip>
          </p>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <Stars max={5} current={review.rating} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-600">{review.message}</p>
      <div className="mt-4 flex items-center flex-wrap space-x-3">
        {images.isSuccess &&
          images.data &&
          images.data.map((url) => (
            <a href={url} key={url} target="_blank" rel="noreferrer">
              <img src={url} alt="" className="h-20 mb-1" />
            </a>
          ))}
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="flex flex-col py-12">
      <div className="flex">
        <Skeleton className="w-10 h-10 !rounded-full mr-4" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex mt-4 space-x-1">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex flex-col mt-4 space-y-3">
        <Skeleton className="h-3" />
        <Skeleton className="h-3 mr-8" />
        <Skeleton className="h-3 mr-24" />
      </div>
    </div>
  );
}
