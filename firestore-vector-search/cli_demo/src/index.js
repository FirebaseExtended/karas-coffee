// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFunctions, httpsCallable } = require("firebase/functions");
const { getAuth, signInAnonymously } = require("firebase/auth");
const { getFirestore, getDoc, doc } = require("firebase/firestore");
const readline = require("readline");

// Your web app's Firebase configuration
const firebaseConfig = {
  // add your config here
};

const COLLECTION_PATH = "test_123";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

// Function to perform the search
async function searchFirestore(query, topK) {
  try {
    await signInAnonymously(auth);
    const vectorSearch = httpsCallable(
      functions,
      "ext-test-index-metadata-queryCallable"
    );
    const result = await vectorSearch({ query, topK });
    console.log("Finished search");
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

// Readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user for input and process the search
rl.question("Enter your search query: ", async (query) => {
  rl.question("How many results do you want to return? ", async (topK) => {
    try {
      const data = await searchFirestore(query, topK);
      const input = data.input;
      console.log("Results:");

      // Ensure numResults is a number and limit the loop accordingly
      const limit = Math.min(parseInt(topK, 10) || input.length, input.length);

      for (let i = 0; i < limit; i++) {
        const id = input[i];
        const docRef = doc(firestore, COLLECTION_PATH, id);
        const docSnapshot = await getDoc(docRef);
        console.log("Document:", `${COLLECTION_PATH}/${docSnapshot.id}`);
        console.log("Input:", docSnapshot.data().input);
      }
    } catch (error) {
      console.error("Error processing search:", error);
    } finally {
      rl.close();
    }
  });
});
