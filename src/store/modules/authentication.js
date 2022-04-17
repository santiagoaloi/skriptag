// Utilities
import { make } from 'vuex-pathify';
import { isEmpty, capitalize, startCase } from 'lodash';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  updatePassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from '@firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { store } from '@/store';
import router from '@/router';

const state = {
  user: {},
  profile: {},
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  // Creates a new user account and routes to profile page.
  async accountRecovery({ dispatch }, email) {
    store.set('loaders/authLoader', true);
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch('snackbar/snackbarSuccess', 'Account recovery email sent.', { root: true });
      store.set('loaders/authLoader', false);
      router.push('login');
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Password reset link with token, allows password recovery.
  async accountRecoveryResetPassword({ dispatch }, { payload }) {
    const { oobCode, newPassword } = payload;
    store.set('loaders/authLoader', true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      dispatch('snackbar/snackbarSuccess', 'Account password changed.', { root: true });
      store.set('loaders/authLoader', false);
      router.push('login');
    } catch ({ ...error }) {
      console.log(error.code);
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Validates the current account password and changes the password.
  async accountResetPassword({ dispatch }, { credentials }) {
    store.set('loaders/authLoader', true);

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, credentials.currentPassword);
      const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(authenticated.user, credentials.newPassword);
      dispatch('snackbar/snackbarSuccess', 'Account password changed', { root: true });
      store.set('loaders/authLoader', false);
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Saves new user profile basic settings.
  async updateProfileSettings({ getters, state }) {
    const userProfile = doc(db, 'users', getters.userId);
    await updateDoc(userProfile, {
      ...state.profile,
    });
  },

  // Logout and clear user data objects in Vuex.
  async logout({ dispatch, getters }) {
    if (getters.isLoggedIn) {
      await signOut(auth);
      store.set('authentication/user', {});
      store.set('authentication/profile', {});

      dispatch('snackbar/snackbarSuccess', 'Hope to see you again soon  💚', { root: true });
      router.push('/');
    }
  },

  // Removes the account and then routes the user to the homepage.
  async removeAccount({ dispatch }, password) {
    try {
      store.set('loaders/authLoader', true);
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);

      // Pass authenticated.user for deletion.
      await deleteUser(authenticated.user);

      store.set('authentication/user', {});
      store.set('authentication/profile', {});
      dispatch('snackbar/snackbarSuccess', 'Account removed, Hope to see you again soon 💚', { root: true });
      router.push('/');
    } catch ({ ...error }) {
      store.set('loaders/authLoader', false);
      dispatch('snackbar/snackbarError', 'Incorrect password, try again', { root: true });
    }
  },

  // If a user is already authenticated, set the user object in Vuex.
  async getCurrentUser() {
    auth.onAuthStateChanged(async (user) => {
      store.set('authentication/user', !user ? {} : user);
    });
  },

  // Login user account, load user profile object and route to profile page.
  async login({ dispatch }, loginForm) {
    store.set('loaders/authLoader', true);
    const { email, password } = loginForm;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      store.set('authentication/user', userCredential.user);
      store.set('loaders/authLoader', false);
      router.push('profile');
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Creates a new user account and routes to profile page.
  async signup({ dispatch }, signupForm) {
    store.set('loaders/signupLoader', true);
    const { email, password } = signupForm;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set user in Vuex and navigate to the new user profile.
      store.set('authentication/user', userCredential.user);
      store.set('loaders/signupLoader', false);
      router.push('profile');

      const { user } = userCredential;

      // Adds a document in a  firestore collection.
      // doc (Firestore instance, collection name, collection id).
      const userDocRef = doc(db, 'users', user.uid);

      // User profile fields to be created in db (payload)
      const userDocData = {
        uid: user.uid,
        email,
        name: signupForm.name,
        lastName: signupForm.lastName,
        avatar: '',
        coverAvatar: '',
        dateCreated: serverTimestamp(),
      };

      // SetDoc (Firestore, Payload)
      // creates the user profile in the db collection.
      setDoc(userDocRef, userDocData);
    } catch ({ ...error }) {
      dispatch('errors/signupMessagesSnackbar', error.code, { root: true });
      store.set('loaders/signupLoader', false);
    }
  },
};

const getters = {
  // Checks if the user is authenticated.
  isLoggedIn: (auth.onAuthStateChanged, (auth) => !isEmpty(auth.user)),

  userId: (state, getters) => {
    if (getters.isLoggedIn) return state.user.uid;
  },

  userEmail: (state, getters) => {
    if (getters.isLoggedIn) return state.user.email;
  },

  // Capitalize the first letter of every word.
  fullName: (state) => {
    const name = startCase(capitalize(state.profile.name));
    const lastName = startCase(capitalize(state.profile.lastName));
    return `${name} ${lastName}`;
  },

  // Shows first name and first letter of last name.
  firstAndShortLast: (state) => {
    const name = startCase(capitalize(state.profile.name));
    const lastName = startCase(capitalize(state.profile.lastName));
    return name && lastName ? `${name} ${lastName[0]}.` : `${name}`;
  },

  // returns current user last login date/time.
  lastLogin: (state, getters) => (getters.isLoggedIn ? state.user.metadata.lastSignInTime : undefined),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
