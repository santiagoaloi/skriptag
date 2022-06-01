import { doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { store } from '@/store';

// export async function setUserAndProfile({ isAuth }) {
//   // Set user object to Vuex.
//   // store.set('authentication/user', isAuth ?? {});

//   const currentId = store.getters['authentication/userId'];
//   const isLoggedIn = store.getters['authentication/isLoggedIn'];
//   const isProfileLoaded = store.getters['authentication/isProfileLoaded'];

//   let profile = {};
//   const docRef = doc(db, 'users', currentId);
//   const q = query(docRef);
//   const unsubscribe = onSnapshot(q, (querySnap) => {
//     profile = querySnap.data();
//     store.set('authentication/profile', profile);
//   });
//   return unsubscribe;
// }
