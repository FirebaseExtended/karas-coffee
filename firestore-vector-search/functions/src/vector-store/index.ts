import { config, VectorStoreProvider } from "../config";
import { FaissNodeVectorStoreClient } from "./faiss_node";
import * as admin from "firebase-admin";
import { FirestoreVectorStoreClient } from "./firestore";
import { embeddingClient } from "../embeddings/client";

export const getVectorStoreClient = ({
  firestore,
  dimension,
}: {
  firestore: admin.firestore.Firestore;
  dimension: number;
}) => {
  switch (config.vectorStoreProvider) {
    case "firestore" as VectorStoreProvider:
      return new FirestoreVectorStoreClient(firestore);
    case "faiss-node" as VectorStoreProvider:
      return new FaissNodeVectorStoreClient(firestore, dimension);
    default:
      throw new Error("Provider option not implemented");
  }
};

export const textVectorStoreClient = getVectorStoreClient({
  firestore: admin.firestore(),
  dimension: embeddingClient.dimension,
});
