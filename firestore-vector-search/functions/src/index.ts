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

import { config } from "./config";
import * as functions from "firebase-functions";
import {
  FirestoreBackfillOptions,
  firestoreProcessBackfillTask,
  firestoreProcessBackfillTrigger,
} from "@invertase/firebase-extension-utilities";
import { handleQueryCall } from "./queries/query_on_call";
import {
  embedProcess,
  handleEmbedOnWrite,
  updateEmbedProcess,
} from "./embeddings";
import { handleQueryOnWrite, textQueryProcess } from "./queries";
import { DocumentData } from "@google-cloud/firestore";

// Embeddings

export const embedOnWrite = functions.firestore
  .document("myCollection/{docId}")
  .onWrite(handleEmbedOnWrite);

const shouldDoBackfill = async (metadata: DocumentData) => {
  if (!config.doBackfill) {
    return false;
  }
  // if the embedding provider or model is different, run the backfill
  if (metadata.embeddingProvider !== config.embeddingProvider) {
    functions.logger.info("Model changed, updating index!");
    return true;
  }
  return false;
};

const backfillOptions: FirestoreBackfillOptions = {
  queueName: config.backfillQueueName,
  collectionName: config.collectionName,
  metadataDocumentPath: config.indexMetadataDocumentPath,
  shouldDoBackfill,
  extensionInstanceId: config.instanceId,
  metadata: {
    embeddingProvider: config.embeddingProvider,
  },
};

//  Backfill

export const backfillTrigger = functions.tasks
  .taskQueue()
  .onDispatch(firestoreProcessBackfillTrigger(embedProcess, backfillOptions));

export const backfillTask = functions.tasks
  .taskQueue()
  .onDispatch(firestoreProcessBackfillTask(embedProcess, backfillOptions));

// Update onConfigure

const updateOptions: FirestoreBackfillOptions = {
  queueName: config.updateQueueName,
  collectionName: config.collectionName,
  metadataDocumentPath: config.indexMetadataDocumentPath,
  shouldDoBackfill,
  extensionInstanceId: config.instanceId,
  metadata: {
    embeddingProvider: config.embeddingProvider,
  },
};

export const updateTrigger = functions.tasks
  .taskQueue()
  .onDispatch(
    firestoreProcessBackfillTrigger(updateEmbedProcess, updateOptions)
  );

export const updateTask = functions.tasks
  .taskQueue()
  .onDispatch(firestoreProcessBackfillTask(updateEmbedProcess, updateOptions));

// Queries

export const queryOnWrite = functions.firestore
  .document(`${config.queryCollectionName}/{queryId}`)
  .onWrite(handleQueryOnWrite);

export const queryCallable = functions.https.onCall(handleQueryCall);
