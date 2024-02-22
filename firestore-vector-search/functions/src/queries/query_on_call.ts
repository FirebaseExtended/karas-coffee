import { config } from '../config';
import * as functions from 'firebase-functions';
import { embeddingClient } from '../embeddings/client';
import { textVectorStoreClient } from '../vector-store';
import { parseQuerySchema, parseTopK } from './util';
import * as admin from 'firebase-admin';
const firestore = admin.firestore();
const textInputField = config.inputField;

// TODO: remove any
export async function handleQueryCall(data: unknown, _context: any) {
  // if (!context.auth) {
  //   // Throwing an error if the user is not authenticated.
  //   throw new functions.https.HttpsError(
  //     "unauthenticated",
  //     "The function must be called while authenticated."
  //   );
  // }
  const queryParams = parseQuerySchema(data);
  const ids = [];
  const text = queryParams['query'] as string | undefined;
  const limit = queryParams['limit'] || 1;

  // TODO: fix this
  // const limit = parseInt(queryParams['limit']);

  if (text) {
    await embeddingClient.initialize();

    const textQueryEmbedding = await embeddingClient.getSingleEmbedding(text);

    // query firestore for the documents

    const docIds = await textVectorStoreClient.query(
      textQueryEmbedding,
      config.collectionName,
      limit,
      config.outputField,
    );

    if (docIds && docIds.length > 0) {
      ids.push(...docIds);
    }
  }

  return {
    ids,
  };
}
