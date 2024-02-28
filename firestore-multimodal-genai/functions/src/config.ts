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
import {SafetySetting as VertexSafetySetting} from '@google-cloud/vertexai';

import {SafetySetting as GoogleAISafetySetting} from '@google/generative-ai';

export enum GenerativeAIProvider {
  GOOGLE_AI = 'google-ai',
  VERTEX_AI = 'vertex-ai',
}

export interface Config {
  vertex: {
    model: string;
  };
  googleAi: {
    model: string;
    apiKey?: string;
  };
  location: string;
  projectId: string;
  instanceId: string;
  prompt: string;
  responseField: string;
  collectionName: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  candidateCount?: number;
  candidatesField?: string;
  maxOutputTokens?: number;
  maxOutputTokensVertex?: number;
  provider?: string;
  apiKey?: string;
  safetySettings?: GoogleAISafetySetting[] | VertexSafetySetting[];
  bucketName?: string;
  imageField: string;
  // ragConfig: {
  //   customRagHookUrl?: string;
  //   customRagHookApiKey?: string;
  //   ragHookInputFields?: string[];
  //   ragHookOutputFields?: string[];
  // };
}

function getSafetySettings(): GoogleAISafetySetting[] | VertexSafetySetting[] {
  const categories = [
    'HARM_CATEGORY_HATE_SPEECH',
    'HARM_CATEGORY_DANGEROUS_CONTENT',
    'HARM_CATEGORY_HARASSMENT',
    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  ];

  const settings = [];

  for (const category of categories) {
    if (process.env[category]) {
      settings.push({
        category,
        threshold: process.env[category],
      });
    }
  }

  switch (process.env.GENERATIVE_AI_PROVIDER) {
    case 'vertex-ai':
      return settings as VertexSafetySetting[];
    case 'google-ai':
      return settings as GoogleAISafetySetting[];
    default:
      throw new Error('Invalid Provider');
  }
}

const defaultBucketName = `${process.env.PROJECT_ID}.appspot.com`;

export default {
  vertex: {
    model: process.env.MODEL!,
  },
  googleAi: {
    model: process.env.MODEL!,
    apiKey: process.env.API_KEY,
  },
  location: process.env.LOCATION!,
  projectId: process.env.PROJECT_ID!,
  instanceId: process.env.EXT_INSTANCE_ID!,
  collectionName:
    process.env.COLLECTION_NAME ||
    'users/{uid}/discussions/{discussionId}/messages',
  prompt: process.env.PROMPT!,
  responseField: process.env.RESPONSE_FIELD || 'output',
  temperature: process.env.TEMPERATURE
    ? parseFloat(process.env.TEMPERATURE)
    : undefined,
  topP: process.env.TOP_P ? parseFloat(process.env.TOP_P) : undefined,
  topK: process.env.TOP_K ? parseInt(process.env.TOP_K) : undefined,
  candidateCount: process.env.CANDIDATE_COUNT
    ? parseInt(process.env.CANDIDATE_COUNT)
    : 1,
  candidatesField: process.env.CANDIDATES_FIELD || 'candidates',
  provider: process.env.GENERATIVE_AI_PROVIDER,
  maxOutputTokensVertex: process.env.MAX_OUTPUT_TOKENS
    ? parseInt(process.env.MAX_OUTPUT_TOKENS)
    : 1024,
  apiKey: process.env.API_KEY,
  safetySettings: getSafetySettings(),
  bucketName: process.env.BUCKET_NAME || defaultBucketName,
  imageField: process.env.IMAGE_FIELD || 'image',
  // ragConfig: {
  //   customRagHookUrl: process.env.CUSTOM_RAG_HOOK_URL,
  //   ragHookInputFields: process.env.RAG_HOOK_INPUT_FIELDS
  //     ? process.env.RAG_HOOK_INPUT_FIELDS.split(',')
  //     : undefined,
  //   ragHookOutputFields: process.env.RAG_HOOK_OUTPUT_FIELDS
  //     ? process.env.RAG_HOOK_OUTPUT_FIELDS.split(',')
  //     : undefined,
  //   // customRagHookApiKey: process.env.RAG_HOOK_API_KEY,
  // },
};
