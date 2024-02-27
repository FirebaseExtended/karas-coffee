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
import {logger} from 'firebase-functions';
import {Config} from './config';

export const init = (config: Config) => {
  const obfuscatedConfig = {
    ...config,
    apiKey: '[REDACTED]',
  };

  logger.info(
    `[firestore-palm-chatbot] Initialized with config: ${JSON.stringify(
      obfuscatedConfig
    )}`
  );
};

export const warnMissingPromptOrResponse = (path: string) => {
  logger.warn(
    `[firestore-palm-chatbot] Document '${path}' is missing either a prompt or response field, will not be included in history!`
  );
};

export const missingField = (field: string, path: string) => {
  logger.info(
    `[firestore-palm-chatbot] Missing ordering field '${field}' on document '${path}', setting to current timestamp.`
  );
};

export const receivedAPIResponse = (
  path: string,
  historyLength: number,
  duration: number
) => {
  logger.info(
    `[firestore-palm-chatbot] Received API response for document '${path}' in ${duration}ms.`,
    {historyLength: historyLength, duration}
  );
};

export const errorCallingGLMAPI = (path: string, error: unknown) => {
  const message = error instanceof Error ? error.message : 'UNKNOWN ERROR';

  logger.error(
    `[firestore-palm-chatbot] Error calling GLM API for document '${path}': ${message}`
  );
};
export const usingADC = () => {
  logger.log('no API key provided, using application default credentials.');
};

export const usingAPIKey = () => {
  logger.log('using API key provided.');
};
