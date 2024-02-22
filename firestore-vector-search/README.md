# Firestore Vector Search

**Author**: (TODO) (**[(TODO)]((TODO))**)

**Description**: This extension calculates



**Details**: Use this extension to automatically embed and query your Firestore documents with the new vector search feature!

When you install this collection you specify a collection and a document field name. Adding or updating a document with this field triggers this extension to calculate a vector embedding for the document.

This vector embedding is written back to the same document, and the document is indexed in the vector store, ready to be queried against.

The extension currently provides two ways to query:

1. A callable function (TODO: this is currently http for ease of development) which takes two parameters, `query`  and `topK`

2. You may specify a collection to write queries to, and the results of the query will be written back to documents added here (with `query` and `topK` fields)

In either case the extension defaults `topK` to the value `1` if it is omitted. 

## Index management with the index document

On installation you will be asked to provide the name of a firestore collection to keep metadata on indexes. The extension will create an index document in this collection. Upon configuring the extension (e.g to use a different model) this document will be checked to see if embeddings need updating in backfill.

### Backfill

This extension uses distributed tasks to backfill a collection and embed existing documents if this feature is enabled.

### Misc

Before installing this extension, make sure that you've [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:




**Configuration Parameters:**

* LLM: Which embedding API do you want to use?


* LLM Function: If you selected \"Other\" as your embedding provider, please provide the URL of your function that will calculate the embeddings.


* Gemini API key: If you selected Gemini to calculate embeddings, please provide your Gemini API key


* OpenAI API key: If you selected OpenAI to calculate embeddings, please provide your OpenAI API key


* Collection path: What is the path to the collection that contains the strings that you want to embed?


* Index Metadata Document Path: What is the path to the document used to manage the index?


* Query collection path: What is the path to the collection that contains the strings that you want to query?


* Input field name: What is the name of the field that contains the string that you want to embed?


* Translations output field name: What is the name of the field where you want to store your embeddings?


* Embed existing documents?: Should existing documents in the Firestore collection be embedded as well?  If you've added new languages since a document was embedded, this will fill those in as well.


* Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).



**Cloud Functions:**

* **backfillTrigger:** Queues the backfill tasks

* **backfillTask:** Performs the embeddings for backfill

* **embedOnWrite:** An event-triggered function that gets called when a document is created or updated. It generates embeddings for the document and writes those embeddings back to firestore

* **queryOnWrite:** An event-triggered function that gets called when a document is created or updated. It generates embeddings for the document and writes those embeddings back to firestore

* **queryCallable:** A callable function that queries a firestore collection with vector search



**APIs Used**:

* aiplatform.googleapis.com (Reason: needed for PaLM embeddings)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to write embeddings to Cloud Firestore.)

* aiplatform.user (Reason: This extension requires access to Vertex AI to create, update and query a Vertex Matching Engine index.)

* storage.objectAdmin (Reason: Allows the extension to write to your Cloud Storage.)
