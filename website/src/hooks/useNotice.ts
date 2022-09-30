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

import { useFunctionsCall, useFunctionsQuery } from '@react-query-firebase/functions';
import { useQueryClient } from 'react-query';
import { functions } from '../firebase';
import { Notice } from '../types';
import { useUser } from './useUser';

export function useNotice(type: string) {
  const user = useUser();
  return useFunctionsQuery<any, Notice>(
    ['notice', type],
    functions,
    'ext-firestore-notice-extension-getNotice',
    {
      type,
    },
    {},
    {
      enabled: !!user.data,
    },
  );
}

export function useAcknowledge() {
  const client = useQueryClient();

  return useFunctionsCall<{ noticeId: string }, void>(
    functions,
    'ext-firestore-notice-extension-acknowledgeNotice',
    {},
    {
      onSuccess() {
        client.invalidateQueries(['notice']);
      },
    },
  );
}

export function useUnacknowledge() {
  const client = useQueryClient();

  return useFunctionsCall<{ noticeId: string }>(
    functions,
    'ext-firestore-notice-extension-unacknowledgeNotice',
    {},
    {
      onSuccess() {
        client.invalidateQueries(['notice']);
      },
    },
  );
}

/**
 * This isn't curretly used however demonstrates how to fetch all user acknowledgements.
 */
// export function useAcknowledgements() {
//   const user = useUser();

//   return useFunctionsQuery<any, any>(['acknowledgements'], functions, 'ext-firestore-notice-extension-getAcknowledgements', {
//     // includeUnacknowledgements: true,
//   }, {}, {
//     enabled: !!user.data,
//   });
// }
