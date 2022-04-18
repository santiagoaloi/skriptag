import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { store } from '@/store';

export async function setUserAndProfile({ isAuth }) {
  // user unique ID.
  const uuid = isAuth?.uid;

  // Set user object to Vuex.
  store.set('authentication/user', isAuth ?? {});

  // Set user profile to Vuex.
  const PROFILE_COLLECTION = 'users';
  const docRef = doc(db, PROFILE_COLLECTION, uuid);
  await onSnapshot(docRef, (docSnap) => {
    const profileData = docSnap.data();

    // Set user-profile object to Vuex.
    store.set('authentication/profile', profileData);
  });
}
