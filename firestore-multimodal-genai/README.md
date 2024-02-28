# Multimodal Tasks with the Gemini API

**Author**: Google Cloud (**[https://cloud.google.com](https://cloud.google.com)**)

**Description**: Performs multimodel generative tasks on text and images, customizable with prompt engineering, using Gemini models and Firestore.



**Details**: This extension allows you to perform generative tasks using the Gemini API, a custom prompt, and Firestore.

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




**Configuration Parameters:**

* Gemini API Provider: This extension makes use of the Gemini family of large language models. Currently the extension supports the Google AI Gemini API (for developers) and the Vertex AI Gemini API. Learn more about the differences between the Google AI and Vertex AI Gemini APIs here.

* Gemini model: Input the name of the Gemini model you would like to use. To view available models for each provider, see: [Vertex AI Gemini models](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models), [Google AI Gemini models](https://ai.google.dev/models/gemini)

* Google AI API Key: If you have selected Google AI as your provider, then this parameteris required. If you have instead selected Vertex AI, then this parameter is not required, and application default credentials will be used.

* Firestore Collection Path: Used to store conversation history represented as documents. This extension will listen to the specified collection(s) for new message documents.

* Prompt: This is the text that you want the Gemini API to generate a response for. It can be free-form text or it can use handlebars variables to substitute values from the Firestore document. For example if you set this parameter as "What is the capital of {{ country }}?"

* Image field (Gemini Pro Vision): A document field containing a cloud storage URL of an image, or a base64 string of an image. Note that this field is only supported by Gemini, and only with the Gemini Pro Vision model.

* Response Field: The field in the message document into which to put the response.

* Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations). Note that Generative AI on Vertex AI is only available in the regions listed [here](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/locations-genai). A list of languages and regions supported by the Gemini API on Google AI is [here](https://ai.google.dev/available_regions).

* Temperature: Controls the randomness of the output. Values can range over [0,1], inclusive. A value closer to 1 will produce responses that are more varied, while a value closer to 0 will typically result in less surprising responses from the model.

* Nucleus sampling probability: If specified, nucleus sampling will be used as the decoding strategy. Nucleus sampling considers the smallest set of tokens whose probability sum is at least a fixed value. Enter a value between 0 and 1.

* Sampling strategy parameter: If specified, top-k sampling will be used as the decoding strategy. Top-k sampling considers the set of topK most probable tokens.

* Candidate count: When set to an integer higher than one, additional candidate responses, up to the specified number, will be stored in Firestore under the 'candidates' field.

* Candidates field: The field in the message document into which to put the other candidate responses if the candidate count parameter is greater than one.

* Hate Speech Threshold: Threshold for hate speech content. Specify what probability level of hate speech content is blocked by the Gemini provider.

* Dangerous Content Threshold: Threshold for dangerous content. Specify what probability level of dangerous content is blocked by the Gemini provider.

* Harassment Content Threshold: Threshold for harassment content. Specify what probability level of harassment content is blocked by the Gemini provider.

* Sexual Content Threshold: Threshold for sexually explicit content. Specify what probability level of sexual content is blocked by the Gemini provider.



**Cloud Functions:**

* **generateText:** Listens to Firestore data writes to generate conversations.



**APIs Used**:

* aiplatform.googleapis.com (Reason: For access to the Vertex AI Gemini API if this provider is chosen.)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows this extension to access Cloud Firestore to read and process added messages.)

* storage.objectAdmin (Reason: Allows the extension to read from your Cloud Storage.)

* aiplatform.user (Reason: Allows this extension to access the Gemini family of genai models via Vertex AI if this provider is chosen.)
