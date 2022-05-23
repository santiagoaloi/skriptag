import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { store } from '@/store';

export async function setUserAndProfile({ isAuth }) {
  // Set user object to Vuex.
  store.set('authentication/user', isAuth ?? {});

  const currentId = store.getters['authentication/userId'];
  const isLoggedIn = store.getters['authentication/isLoggedIn'];
  const isProfileLoaded = store.getters['authentication/isProfileLoaded'];

  if (isLoggedIn && !isProfileLoaded) {
    const docRef = doc(db, 'users', currentId);
    onSnapshot(docRef, (docSnap) => {
      const profileData = docSnap.data();
      store.set('authentication/profile', profileData);
    });
  }
}
