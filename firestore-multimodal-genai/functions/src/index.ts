/**
 * Copyright 2023 Google LLC
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

import * as functions from 'firebase-functions';
import * as logs from './logs';
import config from './config';
import { DocumentReference, FieldValue } from 'firebase-admin/firestore';
import * as Mustache from 'mustache';
import * as admin from 'firebase-admin';

admin.initializeApp();

import { createErrorMessage, missingVariableError, variableTypeError } from './errors';

const { prompt, responseField, collectionName, candidateCount, candidatesField } = config;

import { getGenerativeClient } from './generative-client';
import { extractHandlebarsVariables } from './utils';
// import {fetchCustomHookData} from './custom_hook';

// TODO: make sure we redact API KEY
// logs.init(config);

export const generateText = functions.firestore.document(collectionName).onWrite(async (change) => {
  if (!change.after) {
    return; // do nothing on delete
  }

  const ref: DocumentReference = change.after.ref;

  const data = change.after.data();

  if (!data) {
    // TODO add logging
    return;
  }

  const status = data.status || {};

  const state = status.state;
  const response = data[responseField];

  // only make an API call if prompt exists and is non-empty, response is missing, and there's no in-process status
  if (!prompt || response || ['PROCESSING', 'COMPLETED', 'ERRORED'].includes(state)) {
    // TODO add logging
    return;
  }

  await ref.update({
    status: {
      updateTime: FieldValue.serverTimestamp(),
      startTime: FieldValue.serverTimestamp(),
      state: 'PROCESSING',
    },
  });

  try {
    const view: Record<string, string> = {};

    // if (config.ragConfig?.customRagHookUrl) {
    //   // TODO: extract the variable field values before passing to hook
    //   const customHookData = await fetchCustomHookData(
    //     data,
    //     config.ragConfig
    //   );
    //   data = {
    //     ...data,
    //     ...customHookData,
    //   };
    // }

    const variableFields = extractHandlebarsVariables(prompt);

    for (const field of variableFields || []) {
      if (!data[field]) {
        throw missingVariableError(field);
      }
      if (typeof data[field] !== 'string') {
        throw variableTypeError(field);
      }
      view[field] = data[field];
    }

    // if prompt contains handlebars for variable substitution, do it:
    const substitutedPrompt = Mustache.render(prompt, view);

    const t0 = performance.now();
    // TODO: fix types
    let requestOptions: Record<string, any> = {
      safetySettings: config.safetySettings,
    };
    if (config.googleAi.model === 'gemini-pro-vision') {
      requestOptions = {
        ...requestOptions,
        image: data[config.imageField],
      };
    }

    const generativeClient = getGenerativeClient();
    const result = await generativeClient.generate(substitutedPrompt, requestOptions);

    const duration = performance.now() - t0;
    logs.receivedAPIResponse(ref.path, duration);

    const metadata: Record<string, any> = {
      'status.completeTime': FieldValue.serverTimestamp(),
      'status.updateTime': FieldValue.serverTimestamp(),
    };

    if (result.safetyMetadata) {
      metadata.safetyMetadata = {};

      /** Ensure only defined data is added to the metadata */
      for (const key of Object.keys(result.safetyMetadata)) {
        if (result.safetyMetadata[key] !== undefined) {
          metadata.safetyMetadata[key] = result.safetyMetadata[key];
        }
      }
    }

    const addCandidatesField =
      config.provider === 'generative' && candidatesField && candidateCount && candidateCount > 1;

    if (addCandidatesField) {
      return ref.update({
        ...metadata,
        [responseField]: result.candidates[0],
        [candidatesField]: result.candidates,
        'status.error': null,
      });
    }
    return ref.update({
      ...metadata,
      [responseField]: result.candidates[0],
      'status.state': 'COMPLETED',
    });
  } catch (e: any) {
    logs.errorCallingGLMAPI(ref.path, e);
    const errorMessage = createErrorMessage(e);
    return ref.update({
      'status.state': 'ERRORED',
      'status.completeTime': FieldValue.serverTimestamp(),
      'status.updateTime': FieldValue.serverTimestamp(),
      'status.error': errorMessage,
    });
  }
});

async function handleCall(data: any, context: functions.https.CallableContext) {
  if (!prompt) {
    throw new Error('Prompt is missing from extension config');
  }
  if (config.googleAi.model === 'gemini-pro-vision') {
    throw new Error('Gemini Pro Vision not supported in callable yet');
  }
  const variableFields = extractHandlebarsVariables(prompt);
  const view: Record<string, string> = {};

  for (const field of variableFields || []) {
    if (!data[field]) {
      throw missingVariableError(field);
    }
    if (typeof data[field] !== 'string') {
      throw variableTypeError(field);
    }

    view[field] = data[field];
  }
  const substitutedPrompt = Mustache.render(prompt, view);

  const generativeClient = getGenerativeClient();
  // TODO: fix types
  let requestOptions: Record<string, any> = {
    safetySettings: config.safetySettings,
  };
  try {
    const result = await generativeClient.generate(substitutedPrompt, requestOptions);
    console.log('result_____________:', result);
    return result;
  } catch (e: any) {
    logs.errorCallingGLMAPI('callable', e);
    throw new Error('Error calling Gemini API');
  }
}

export const generateOnCall = functions.https.onCall(handleCall);
