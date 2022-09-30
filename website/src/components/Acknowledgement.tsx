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
import { useAcknowledge, useNotice, useUnacknowledge } from '../hooks/useNotice';
import { useUser } from '../hooks/useUser';
import { Alert } from './Alert';
import { Button } from './Button';

export function Acknowledgement() {
  const user = useUser();
  
  const notice = useNotice('banner');
  const acknowledge = useAcknowledge();
  const unacknowledge = useUnacknowledge();

  return (
    <div className="mt-2">
      <Alert type="warning">
        <div className='flex items-center gap-3'>
          <div className='flex-grow text-left'>
            Please note that Kara&rsquo;s Coffee is a demo application, and some functionality is restricted to limit
            processing of personal data.
          </div>
          <div>
            {!!user.data && notice.isSuccess && notice.data.acknowledgements.length === 0 && notice.data.unacknowledgedAt === null && (
              <Button
                loading={acknowledge.isLoading}
                onClick={() => {
                  acknowledge.mutate({
                    noticeId: notice.data.id,
                  });
                }}
                >
                Acknowledge
              </Button>
            )}
            {!!user.data && notice.isSuccess && notice.data.unacknowledgedAt !== null && (
              <p className='flex items-center gap-2'>
                <span>Unacknowledged</span>
                <Button
                  loading={acknowledge.isLoading}
                  onClick={() => {
                    acknowledge.mutate({
                      noticeId: notice.data.id,
                    });
                  }}
                >
                  Acknowledge
                </Button>
              </p>
            )}
            {!!user.data && notice.isSuccess && notice.data.acknowledgements.length > 0 && notice.data.unacknowledgedAt === null && (
              <p className='flex items-center gap-2'>
                <span>
                  Acknowledged
                </span>
                <Button
                  loading={unacknowledge.isLoading}
                  onClick={() => {
                  unacknowledge.mutate({
                    noticeId: notice.data.id,
                  });
                }}
                >
                  Unacknowledge
                </Button>
              </p>
            )}
            {!user.data && (
              <p>Sign in to acknowledge</p>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}
