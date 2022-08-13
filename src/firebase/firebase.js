// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// connectAuthEmulator,
// connectFirestoreEmulator
// connectFunctionsEmulatorx
// connectStorageEmulator

const firebaseConfig = {
  apiKey: process.env.VUE_APP_SKRIPTAG_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_SKRIPTAG_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_SKRIPTAG_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_SKRIPTAG_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_SKRIPTAG_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_SKRIPTAG_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const functions = getFunctions(app);
const db = getFirestore(app);
const auth = getAuth(app);
const getUserState = () =>
  new Promise((resolve, reject) => {
    onAuthStateChanged(auth, resolve, reject);
  });

const development = process.env.NODE_ENV === 'development';

// Enable emulators.
const usingEmulators = false;

const emulate = {
  storage: false,
  functions: false,
  firestore: false,
  auth: false,
};

// If  usingEmulators run all the emulators
// instead of production servers.

if (usingEmulators) {
  if (emulate.storage) {
    connectStorageEmulator(storage, 'localhost', 5001);
  }

  if (emulate.functions) {
    connectFunctionsEmulator(functions, 'localhost', 5002);
  }

  if (emulate.firestore) {
    connectFirestoreEmulator(db, 'localhost', 5003);
  }

  if (emulate.auth) {
    connectAuthEmulator(auth, 'http://localhost:5004', { disableWarnings: true });
  }
}

if (development) {
  // appCheck debug token for development.
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.VUE_APP_SKRIPTAG_FIREBASE_APP_CHECK_DEBUG_TOKEN_FROM_CI;
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.VUE_APP_SKRIPTAG_FIREBASE_RECAPTCHA_PROVIDER_TOKEN),
  isTokenAutoRefreshEnabled: true,
});

export { db, storage, auth, functions, getUserState };
