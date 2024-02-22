import * as admin from 'firebase-admin';

export class FirestoreVectorStoreClient {
  firestore: admin.firestore.Firestore;
  constructor(firestore?: admin.firestore.Firestore) {
    this.firestore = firestore;
  }
  async query(query: number[], collection: string, limit: number, outputField: string): Promise<string[]> {
    const col = this.firestore.collection(collection);

    const q = col.findNearest(outputField, query, {
      limit,
      distanceMeasure: 'COSINE',
    });

    const result = await q.get();

    return result.docs.map((doc) => doc.ref.id);
  }
}
