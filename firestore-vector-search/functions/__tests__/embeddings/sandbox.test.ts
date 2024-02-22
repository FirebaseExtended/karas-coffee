import * as admin from "firebase-admin";
admin.initializeApp({
  projectId: "fir-vector-invertase-03",
});

const firestore = admin.firestore();
const docId = Math.random()
  .toString(36)
  .substring(7);
describe("sandbox", () => {
  test("sandbox", async () => {
    // const phrases = [
    //   "tree river",
    //   "leaf ocean",
    //   "ice bird",
    //   "mountain fish",
    //   "bird forest",
    //   "rain fire",
    //   "storm flower",
    //   "moon river",
    //   "rain fish",
    //   "fish tree",
    //   "ocean forest",
    //   "ice fire",
    //   "flower mountain",
    //   "fish mountain",
    //   "rain tree",
    //   "moon ice",
    //   "rain fish",
    //   "forest moon",
    //   "storm leaf",
    //   "sky wind",
    // ];

    // for (let phrase of phrases) {
    //   await firestore.collection("backfill_test").add({ input: phrase });
    // }

    await firestore
      .collection("index_test_123")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
        });
      });

    await firestore
      .collection("backfill_test")
      .get()
      .then((snapshot) => {
        const docs = snapshot.docs;

        console.log(docs.map((doc) => doc.data()));
      });
  }, 10000);
});
// Run the functions
