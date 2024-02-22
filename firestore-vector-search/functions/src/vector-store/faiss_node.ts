import { IndexFlatL2 } from 'faiss-node';
import * as admin from 'firebase-admin';
import { VectorStoreClient } from './base_class';

/**
 * using the faiss-node library, this class will query the index for the nearest neighbors, all in memory, so will hit CF limits with big collections/queries.
 */
export class FaissNodeVectorStoreClient extends VectorStoreClient {
  firestore: admin.firestore.Firestore;
  dimension: number;
  constructor(firestore: admin.firestore.Firestore, dimension: number) {
    super(firestore);
    this.firestore = firestore;
    this.dimension = dimension;
  }

  async query(query: number[], collectionPath: string, limit: number, outputField: string) {
    const index = await this.createIndex();
    const embeddedDocuments = await this.getEmbeddedDocuments(collectionPath, index, outputField);
    const { labels } = index.search(query, limit);

    const result = embeddedDocuments.filter((_, i) => labels.includes(i));
    return result.map((d) => d.id);
  }

  async createIndex() {
    console.log('creating index of dimension', this.dimension);
    return new IndexFlatL2(this.dimension);
  }

  async getEmbeddedDocuments(collectionPath: string, index: IndexFlatL2, outputField: string) {
    // query the collection for documents with an embedding field
    const collection = this.firestore.collection(collectionPath);
    const documents = await collection.get();
    const docs = documents.docs;
    const embeddedDocuments: { id: string; embedding: number[] }[] = [];
    for (let doc of docs) {
      const data = doc.data();
      if (!data || !data[outputField] || typeof data[outputField] !== 'string') {
        // functions.logger.error(
        //     `Document ${doc.ref.path} is missing embedding field of type string`
        // );
      } else {
        const embedding = this.coerceToVector(data[outputField]);
        index.add(embedding);
        embeddedDocuments.push({ id: doc.ref.id, embedding });
      }
    }

    return embeddedDocuments;
  }

  coerceToVector(value: string) {
    // get substring between [ and ]
    const vector = value.substring(value.indexOf('['), value.indexOf(']') + 1);

    return JSON.parse(vector);
  }
}
