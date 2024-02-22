import * as admin from "firebase-admin";

admin.initializeApp();

export const enum EmbeddingProvider {
  Gemini = "gemini",
  Multimodal = "multimodal",
  OpenAI = "openai",
  Custom = "custom",
}

const embeddingProvider: EmbeddingProvider = process.env
  .EMBEDDING_PROVIDER as EmbeddingProvider;

export const enum VectorStoreProvider {
  Firestore = "firestore",
}

const vectorStoreProvider: VectorStoreProvider = process.env
  .VECTOR_STORE_PROVIDER as VectorStoreProvider;

const LOCATION = process.env.LOCATION;

const defaultBucketName = `${process.env.PROJECT_ID}.appspot.com`;

export const config = {
  inputField: process.env.INPUT_FIELD_NAME,
  outputField: process.env.OUTPUT_FIELD_NAME,
  collectionName: process.env.COLLECTION_NAME || "embeddings",
  queryCollectionName: process.env.QUERY_COLLECTION_NAME || "fvs_queries",
  backfillQueueName: `locations/${LOCATION}/functions/backfillTask`,
  updateQueueName: `locations/${LOCATION}/functions/updateTask`,
  instanceId: process.env.EXT_INSTANCE_ID!,
  projectId: process.env.PROJECT_ID!,
  location: process.env.LOCATION!,
  doBackfill: process.env.DO_BACKFILL === "true",
  customEmbeddingConfig: {
    batchSize: process.env.CUSTOM_EMBEDDINGS_BATCH_SIZE
      ? parseInt(process.env.CUSTOM_EMBEDDINGS_BATCH_SIZE)
      : undefined,
    endpoint: process.env.CUSTOM_EMBEDDINGS_ENDPOINT,
    dimension: process.env.CUSTOM_EMBEDDINGS_DIMENSION
      ? parseInt(process.env.CUSTOM_EMBEDDINGS_DIMENSION)
      : undefined,
  },
  embeddingProvider: embeddingProvider,
  multimodal: embeddingProvider === EmbeddingProvider.Multimodal,
  vectorStoreProvider: "firestore",
  geminiApiKey: process.env.GEMINI_API_KEY,
  openAIApiKey: process.env.OPENAI_API_KEY,
  statusMapField: process.env.STATUS_MAP_FIELD || "statusMap",
  bucketName: process.env.BUCKET_NAME || defaultBucketName,
  indexMetadataDocumentPath: `${process.env.INDEX_METADATA_COLLECTION}/${
    process.env.EXT_INSTANCE_ID
  }`,
};

export const obfuscatedConfig = { ...config, geminiApiKey: "<omitted>" };
