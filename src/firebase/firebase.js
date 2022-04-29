// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth';

// Activate Emulators
const useEmulators = true;

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
const storage = getStorage();
const functions = getFunctions(app);
const db = getFirestore(app);
const auth = getAuth(app);
const getUserState = () => new Promise((resolve, reject) => onAuthStateChanged(auth, resolve, reject));

// If  useEmulators is true, run all the emulators
// instead of production servers.
if (useEmulators) {
  connectStorageEmulator(storage, 'localhost', 5001);
  connectFunctionsEmulator(functions, 'localhost', 5002);
  connectFirestoreEmulator(db, 'localhost', 5003);
  connectAuthEmulator(auth, 'http://localhost:5004', { disableWarnings: true });
}

export { db, storage, auth, functions, getUserState };
