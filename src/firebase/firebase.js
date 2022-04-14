// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref } from 'firebase/storage';

// The .env file contains the api keys used below.
const firebaseConfig = {
  apiKey: process.env.VUE_APP_SKRIPTAG_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_SKRIPTAG_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_SKRIPTAG_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_SKRIPTAG_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_SKRIPTAG_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_SKRIPTAG_FIREBASE_APP_ID,
  measurementId: process.env.NVUE_APP_SKRIPTAG_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth(app);
export const getUserState = () => new Promise((resolve, reject) => onAuthStateChanged(getAuth(), resolve, reject));
export { auth, db, storage };
