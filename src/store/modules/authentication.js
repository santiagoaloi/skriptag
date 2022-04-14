// Utilities
import { make } from 'vuex-pathify';
import { isEmpty, capitalize, startCase } from 'lodash';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { store } from '@/store';
import router from '@/router';

const state = {
  user: {},
  loginForm: {},
  signupForm: {},
  profile: {},
};

const PROFILE_COLLECTION = 'users'; // name of the FS collection of user profile docs

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  async updateProfileSettings({ getters, state }) {
    const userProfile = doc(db, 'users', getters.userId);
    await updateDoc(userProfile, {
      ...state.profile,
    });
  },

  // Logout and clear user data object in Vuex.
  async logout({ dispatch, getters }) {
    if (getters.isLoggedIn) {
      await signOut(auth);
      store.set('authentication/user', {});
      store.set('authentication/profile', {});

      dispatch('snackbar/snackbarSuccess', 'Hope to see you again soon  💚', { root: true });
      router.push('/');
    }
  },

  // If a user is already authenticated, set the user object in Vuex.
  async fetchUser() {
    auth.onAuthStateChanged(async (user) => {
      store.set('authentication/user', !user ? {} : user);
    });
  },

  async login({ dispatch, state }) {
    store.set('loaders/authLoader', true);
    const { email, password } = state.loginForm;

    // Attempt to login only if both email and password fields have values.
    if (!state.loginForm.email || !state.loginForm.password) {
      dispatch('snackbar/snackbarError', 'You have to provide both an email and password.', { root: true });
      store.set('loaders/authLoader', false);
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        store.set('authentication/user', userCredential.user);
        store.set('loaders/authLoader', false);

        router.push('profile');
      } catch ({ ...error }) {
        dispatch('loginMessagesSnackbar', error.code);
        store.set('loaders/authLoader', false);
      }
    }
  },

  async signup({ dispatch, state }) {
    store.set('loaders/signupLoader', true);
    const { email, password } = state.signupForm;

    // Attempt to signup only if both email and password fields have values.
    if (!state.signupForm.email || !state.signupForm.password) {
      dispatch('snackbar/snackbarError', 'You have to provide both an email and password.', { root: true });
      store.set('loaders/signupLoader', false);
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Set user in Vuex and navigate to the new user profile.
        store.set('authentication/user', userCredential.user);
        store.set('loaders/signupLoader', false);
        router.push('profile');

        const { user } = userCredential;

        // Adds a document in a  firestore collection.
        // doc (Firestore instance, collection name, collection id).
        const userDocRef = doc(db, PROFILE_COLLECTION, user.uid);

        // User profile fields to be created in db (payload)
        const userDocData = {
          uid: user.uid,
          email,
          name: state.signupForm.name,
          lastName: state.signupForm.lastName,
          avatar: '',
          coverAvatar: '',
          dateCreated: serverTimestamp(),
        };

        // SetDoc (Firestore, Payload)
        // creates the user profile in the db collection.
        setDoc(userDocRef, userDocData);
      } catch ({ ...error }) {
        dispatch('signupMessagesSnackbar', error.code);
        store.set('loaders/signupLoader', false);
      }
    }
  },

  // Snackbar error messages.
  signupMessagesSnackbar({ dispatch }, message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }

    if (message.includes('auth/weak-password')) {
      dispatch('snackbar/snackbarError', 'Password should be at least 6 characters long.', { root: true });
      return;
    }

    if (message.includes('auth/email-already-in-use')) {
      dispatch('snackbar/snackbarError', 'Aother account is already using this email.', { root: true });
      return;
    }

    if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'Too many invalid attemps, please try again later.', { root: true });
      return;
    }

    if (message.includes('auth/email-already-in-use')) {
      dispatch('snackbar/snackbarError', 'This email is already in use,', { root: true });
    }

    dispatch('snackbar/snackbarError', 'Something did not go right.', { root: true });
  },

  // Snackbar error messages.
  loginMessagesSnackbar({ dispatch }, message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }

    if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'This email is not valid, please check that again.', { root: true });
    } else if (message.includes('auth/wrong-password')) {
      dispatch('snackbar/snackbarError', 'You password is incorrect , please try again.', { root: true });
    } else if (message.includes('auth/user-not-found')) {
      dispatch('snackbar/snackbarError', 'This account does not exist in our records.', { root: true });
    } else if (message.includes('auth/too-many-attempts')) {
      dispatch('snackbar/snackbarError', 'Too many invalid attemps, please try again later..', { root: true });
    } else {
      dispatch('snackbar/snackbarError', 'Something did not go right.', { root: true });
    }
  },
};

const getters = {
  // Checks if the user is authenticated.
  isLoggedIn: (auth.onAuthStateChanged, (auth) => !isEmpty(auth.user)),

  userId: (state, getters) => {
    if (getters.isLoggedIn) return state.user.uid;
  },

  // Capitalize the first letter of every word.
  fullName: (state) => {
    const name = startCase(capitalize(state.profile.name));
    const lastName = startCase(capitalize(state.profile.lastName));
    return `${name} ${lastName}`;
  },

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
