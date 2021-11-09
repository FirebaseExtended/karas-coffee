The Firestore Perspective Toxicity extension provides details on the toxicity of comments provided within the website.
The details include the following properties which can be used to filter comment visibility.

- IDENTITY_ATTACK
- INSULT
- PROFANITY
- SEVERE_TOXICITY
- THREAT
- TOXICITY

# Configuration

Toxicity detection is utilized on the website by reading from a `reviews` sub-collection on products within the website. User submitted review comments are saved to this collection.

The collection is monitored by the extension for any document updates and picks up via the `message` field in the
document. This is then analyzed and will provide a score determining the toxicity of the message provided.

---

## Example

To ensure that the comment does not display toxic comments from the moment they are submitted, the comment is initially
hidden. A prompt informs the user that the submission is going to be analysed, while the extension marks the comment.

![image](https://user-images.githubusercontent.com/2060661/139254800-4d48d3a4-33d4-45b5-9b67-127bbfbacd0c.png)

In addition, the website has a hard coded `threshold` level which determines the level at which toxic comments can be
displayed, in this demo example the threshold is `0.6`

```js
export const TOXICITY_THRESHOLD = 0.6;
```

Once completed, the page is refreshed with comments that have a `TOXICITY` score less `0.6`.

A code filter would look like

```js
const user = useUser();
const collection = collections.productReviews(productId);

const constraints: QueryConstraint[] = [];

constraints.push(orderBy("attribute_scores.TOXICITY"));
constraints.push(orderBy("created_at", "desc"));

// Ensure the record has all the toxicity fields.
constraints.push(
  where(new FieldPath("attribute_scores", "TOXICITY"), "<", TOXICITY_THRESHOLD)
);

// For this example, only show the users own reviews.
constraints.push(where("user.id", "==", user.data?.uid ?? "-"));

return useFirestoreQueryData(
  ["reviews", productId],
  query(collection, ...constraints),
  {
    subscribe: true,
  },
  {
    enabled: !user.isLoading,
  }
);
```

A review with a poor toxicity rating, will be flagged and the user informed that the language used was too toxic for the
comment to be posted

![image](https://user-images.githubusercontent.com/2060661/139255330-fca0099d-b931-4a28-b6e0-1518c665f779.png)

A user will then have the option to edit the post and resubmit, should they want to attempt a resubmission.
