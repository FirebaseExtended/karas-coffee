This extension allows you to perform generative tasks using the Gemini API, a custom prompt, and Firestore.

On installation, you will be asked to provide the following information:

- **Gemini API Provider** This extension makes use of the Gemini family of models. Currently the extension supports the Google AI Gemini API and the Vertex AI Gemini API. Learn more about the differences between the Google AI and Vertex AI Gemini APIs [here](https://cloud.google.com/vertex-ai/docs/generative-ai/migrate/migrate-google-ai).

Note that Generative AI on Vertex AI is only available in the regions listed [here](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/locations-genai).

A list of languages and regions supported by the Gemini API on Google AI is [here](https://ai.google.dev/available_regions).

**Gemini Model**: Input the name of which Gemini model you would like to use. To view available models for each provider, see:

- [Vertex AI Gemini models](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models)
- [Google AI Gemini models](https://ai.google.dev/models/gemini)
  **Firestore Collection Path**: This extension will listen to the specified collection(s) for new task documents.
  **Prompt**: This is the text that you want the Gemini API to generate a response for. It can be free-form text or it can use handlebars variables to substitute values from the Firestore document.

This extension will listen to the specified collection for new documents. When such a document is added, the extension will:

1. Substitute any variables from the document into the prompt.
2. Query the Gemini API to generate a response based on the prompt.
3. Write the response from the Model API back to the triggering document in the response field.

Note that the extension only supports top-level handlebars variables, substitution into nested handlebar templates is not supported.

Each instance of the extension should be configured to perform one particular task. If you have multiple tasks, you can install multiple instances.

For example, you could use this extension to:

- Predict star ratings on a collection of product reviews.
- Classify customer feedback as positive, negative, or neutral.
- Summarize long articles.
- Extract named entities from text.
- Generate creative text, such as poems or code.

Here’s an example prompt used for predicting star ratings on a collection of product reviews:

```
Provide a star rating from 1-5 of the following review text: “This is a truly incredible water bottle, I keep it with me all the time when I’m traveling and it has never let me down.”
5

Provide a star rating from 1-5 of the following review text: “I really enjoyed the water bottle, I just wish they carried this in a larger size as I go for long hikes. But overall the aesthetic, manufacturing, and functional design are great for what I needed.”
4

Provide a star rating from 1-5 of the following review text: “The water bottle was fine, although the design was a bit lacking and could be improved.”
3

Provide a star rating from 1-5 of the following review text: “Please don’t get this water bottle, there are major design flaws, for example the cap doesn’t screw on fully so water leaks into my backpack all the time.”
1

Provide a star rating from 1-5 of the following review text: \“{{review_text}}\”
```

In this case, `review_text`` is a field of the Firestore document and will be substituted into the prompt when querying.

### Choosing a generative model

When installing this extension you will be prompted to pick a Gemini model.

For Google AI the list of supported models is [here](https://ai.google.dev/models/gemini), and this parameter should be set to the model name, the second segment of the model code (for
example models/gemini-pro should be chosen as gemini-pro).

For Vertex AI, the list of models is [here](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models).

#### Multimodal Prompts

This extension supports providing multimodal prompts. To use this feature, select the Gemini Pro Vision model on installation, and provide an Image Field parameter. The Image Field parameter should be the name of a document field in firestore.

When you select these options, any document handled by the extension must contain an image field. The image field must be a string, and can either be the Cloud Storage URL of an object (e.g `gs://my-bucket.appspot.com/filename.png`). This image will then be provided as part of the prompt to Gemini Pro Vision.

The Gemini Pro Vision API has a limit on image sizes. For Google AI this limit is currently 1MB, and for Vertex AI this limit is 4MB. This extension will compress and resize images that fall above this limit.

### Troubleshooting timeout/PROCESSING errors

This extension will update the state of a document that is being processed within that status field of that document. When using Gemini Pro Vision with large images, there is a possibility that the process of compressing and resizing the image will exceed the extension's cloud function memory. By default this extension deploys a cloud function with 2GiB of memory, which should handle most use cases. If for some reason this is too much memory, you may reconfigure the function in the GCP console.

### Regenerating a response

Changing the state field of a completed document's status from `COMPLETED` to anything else will retrigger the extension for that document.

## Billing

To install an extension, your project must be on the Blaze (pay as you go) plan. You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:

- Cloud Firestore
- Cloud Functions (See [FAQs](https://firebase.google.com/support/faq#extensions-pricing))
- Associated costs for using Vertex AI ([see their pricing](https://cloud.google.com/vertex-ai/pricing#generative_ai_models)) if you use this provider.
- Associated costs for using Google AI ([see their pricing](https://ai.google.dev/pricing)) if you use this provider.

[Learn more about Firebase billing.](https://firebase.google.com/pricing)
