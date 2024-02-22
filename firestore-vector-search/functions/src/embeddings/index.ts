import { config } from "../config";
import {
  FirestoreOnWriteProcess,
  FirestoreOnWriteProcessor,
} from "@invertase/firebase-extension-utilities";
import { DocumentData, FieldValue } from "@google-cloud/firestore";
import { embeddingClient } from "./client";
import * as functions from "firebase-functions";

const embed = async (input) => {
  await embeddingClient.initialize();
  const text = input[config.inputField];

  let embedding: number[];
  try {
    embedding = await embeddingClient.getSingleEmbedding(text);
  } catch (e) {
    console.error("Error fetching embeddings:", e);
    throw new Error("Error with embedding");
  }

  return { [config.outputField]: FieldValue.vector(embedding) };
};

const batchEmbedFn = async (docs: DocumentData[]) => {
  await embeddingClient.initialize();
  const embeddings = await embeddingClient.getEmbeddings(
    docs.map((doc) => doc[config.inputField] as string)
  );
  return embeddings.map((embedding) => ({
    [config.outputField]: FieldValue.vector(embedding),
  }));
};

const shouldBackfill = (data) => {
  const hasValidInput =
    data[config.inputField] && typeof data[config.inputField] === "string";

  return hasValidInput;
};

export const embedProcess = new FirestoreOnWriteProcess(embed, {
  id: config.instanceId,
  fieldDependencyArray: [config.inputField],
  shouldBackfill,
  batchFn: batchEmbedFn,
});

const shouldUpdate = (data: Record<string, any>) => {
  const hasValidInput =
    data[config.inputField] && typeof data[config.inputField] === "string";

  const hasExistingOutput = data[config.outputField];

  return hasValidInput && hasExistingOutput;
};

export const updateEmbedProcess = new FirestoreOnWriteProcess(embed, {
  id: config.instanceId,
  fieldDependencyArray: [config.inputField],
  shouldBackfill: shouldUpdate,
});

const embedOnWriteProcessor = new FirestoreOnWriteProcessor({
  processes: [embedProcess],
});

export const handleEmbedOnWrite = (
  change: functions.Change<functions.firestore.DocumentSnapshot>
) => {
  return embedOnWriteProcessor.run(change);
};
