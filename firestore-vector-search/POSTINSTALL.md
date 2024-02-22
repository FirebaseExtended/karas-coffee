### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

2.  If it doesn't exist already, create a collection called `${param:COLLECTION_PATH}`.

3.  Create a document with a field named `${param:INPUT_FIELD_NAME}`, and add text you would like to embed.

4.  In a few seconds, you'll see a new field called `${param:OUTPUT_FIELD_NAME}` pop up in the same document you just created. It will contain the embedding for the text in `${param:INPUT_FIELD_NAME}`

5. Now either query the deployed HTTP/Callable function, or create a document in `${param:QUERY_COLLECTION_NAME}` with a string value for the `query` field.

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
