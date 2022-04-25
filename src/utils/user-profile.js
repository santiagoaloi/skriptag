import { doc, getDoc } from 'firebase/firestore';
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
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      store.set('authentication/profile', docSnap.data());
    }
  }
}
