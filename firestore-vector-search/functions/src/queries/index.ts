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
import { config } from "../config";
import {
  FirestoreOnWriteProcess,
  FirestoreOnWriteProcessor,
} from "@invertase/firebase-extension-utilities";
import { embeddingClient } from "../embeddings/client";
import { textVectorStoreClient } from "../vector-store";
import * as functions from "firebase-functions";

const performTextQuery = async ({
  query,
  limit = 1,
}: {
  query: string;
  limit?: number;
}) => {
  await embeddingClient.initialize();

  const embedding = await embeddingClient.getSingleEmbedding(query);
  const result = await textVectorStoreClient.query(
    embedding,
    config.collectionName,
    limit,
    config.outputField
  );
  return { [config.inputField + "Result"]: result };
};

export const textQueryProcess = new FirestoreOnWriteProcess(performTextQuery, {
  id: "textQuery",
  fieldDependencyArray: ["query", "limit"],
});

const textQueryOnWriteProcessor = new FirestoreOnWriteProcessor({
  processes: [textQueryProcess],
});

export const handleQueryOnWrite = (
  change: functions.Change<functions.firestore.DocumentSnapshot>
) => {
  return textQueryOnWriteProcessor.run(change);
};
