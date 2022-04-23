// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

// Activate Emulators
const useFunctionsEmulator = true;

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
const functions = getFunctions(app);
const getUserState = () => new Promise((resolve, reject) => onAuthStateChanged(auth, resolve, reject));

// If the functions emulator is enabled,
// Run local functions instead.
if (useFunctionsEmulator) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { db, storage, auth, functions, getUserState };
