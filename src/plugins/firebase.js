// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDHs-rDodc  9sdVxCvdqVsqpebINinvR4FQ',
  authDomain: 'api-project-168316452208.firebaseapp.com',
  databaseURL: 'https://api-project-168316452208.firebaseio.com',
  projectId: 'api-project-168316452208',
  storageBucket: 'api-project-168316452208.appspot.com',
  messagingSenderId: '168316452208',
  appId: '1:168316452208:web:f17a580abdb11877e8e3b5',
  measurementId: 'G-89T48X8F7W',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, onAuthStateChanged };
