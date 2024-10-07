// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, get, child } = require("firebase/database");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "OUR_FIREBASE_API_KEY",
  authDomain: "OUR_FIREBASE_DATABASE_DOMAIN",
  projectId: "OUR_FIREBASE_PROJECT_ID",
  storageBucket: "OUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "OUR_ID",
  appId: "OUR_APP_ID",
  databaseURL: "OUR_DATABASE_URL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

async function subscribeToNotif(path, row, email) {
  console.log("path -", path);
  console.log("row -", row);
  console.log("email -", email);
  const key = `${path}/${row}`;
  const dbRef = ref(database, key);
  try {
      await set(dbRef, { email });
      console.log(`Data saved with key ${key} and email: ${email}`);
  } catch (error) {
      console.error("Error writing data:", error);
  }
  }

module.exports = subscribeToNotif;