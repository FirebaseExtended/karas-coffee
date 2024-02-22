/*
 * Copyright 2021 Google LLC
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

// import { initializeApp } from 'firebase/app';
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  projectId: 'fir-vector-invertase-03', // Replace with your Firestore project ID
});

const db = admin.firestore();
db.settings({
  host: 'localhost:8080', // Default Firestore emulator host and port
  ssl: false,
});

// Function to import JSON data into Firestore
async function importDataToFirestore(collectionName, filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const batch = db.batch();

  data.forEach((doc, index) => {
    // Assuming each document in your JSON array has a unique identifier under 'id'
    const docRef = db.collection(collectionName).doc(doc.id || String(index));
    batch.set(docRef, doc);
  });

  await batch.commit();
  console.log(`Successfully imported data to the '${collectionName}' collection in Firestore emulator.`);
}

// Example usage - adjust the collection name and file path as needed

const cwd = process.cwd();

const getFilePath = (collectionName) => path.join(cwd, `${collectionName}.json`);

const collectionNames = ['bundles', 'content', 'notices', 'products', 'templates', 'urls'];

for (const collectionName of collectionNames) {
  importDataToFirestore(collectionName, getFilePath(collectionName)).catch(console.error);
}
