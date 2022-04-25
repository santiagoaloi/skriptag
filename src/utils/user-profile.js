import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { store } from '@/store';

export async function setUserAndProfile({ isAuth }) {
  // user unique ID.
  const uuid = isAuth?.uid;

  // Set user object to Vuex.
  store.set('authentication/user', isAuth ?? {});

  // Set user profile to Vuex.
  const docRef = doc(db, 'users', uuid);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    const profileData = docSnap.data();
    // Set user-profile object to Vuex.
    store.set('authentication/profile', profileData);
  });
}
