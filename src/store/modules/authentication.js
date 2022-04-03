// Utilities
import { make } from 'vuex-pathify';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@firebase/auth';
import { isEmpty } from 'lodash';
import { store } from '@/store';
import { auth } from '@/firebase/firebase';
import router from '@/router';

const state = {
  user: {},
  loginForm: {},
  signupForm: {},
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  async logout({ dispatch, getters }) {
    if (getters.isLoggedIn) {
      await signOut(auth);
      store.set('authentication/user', {});
      dispatch('snackbar/snackbarSuccess', 'Hope to see you again soon  💚', { root: true });
      router.push('/');
    }
  },

  async fetchUser() {
    auth.onAuthStateChanged(async (user) => {
      store.set('authentication/user', !user ? {} : user);
    });
  },

  async login({ dispatch, state }) {
    store.set('loaders/authLoader', true);
    const { email, password } = state.loginForm;
    if (!state.loginForm.email || !state.loginForm.password) {
      dispatch('snackbar/snackbarError', 'You have to provide both an email and password.', { root: true });
      store.set('loaders/authLoader', false);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          store.set('authentication/user', userCredential.user);
          store.set('loaders/authLoader', false);
          router.push('profile');
        })
        .catch(({ ...error }) => {
          dispatch('loginMessagesSnackbar', error.code);
          store.set('loaders/authLoader', false);
        });
    }
  },

  async signup({ dispatch, state }) {
    store.set('loaders/signupLoader', true);
    const { email, password } = state.signupForm;
    if (!state.signupForm.email || !state.signupForm.password) {
      dispatch('snackbar/snackbarError', 'You have to provide both an email and password.', { root: true });
      store.set('loaders/signupLoader', false);
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // store.set('authentication/user', userCredential.user);
          store.set('loaders/signupLoader', false);
          router.push('/profile');
        })
        .catch(({ ...error }) => {
          store.set('loaders/signupLoader', false);
          dispatch('signupMessagesSnackbar', error.code);
        });
    }
  },

  signupMessagesSnackbar({ dispatch }, message) {
    // console.log(message);
    if (message.includes('auth/weak-password')) {
      dispatch('snackbar/snackbarError', 'Password should be at least 6 characters long.', { root: true });
    } else if (message.includes('auth/email-already-in-use')) {
      dispatch('snackbar/snackbarError', 'Aother account is already using this email.', { root: true });
    } else if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'Too many invalid attemps, please try again later..', { root: true });
    } else if (message.includes('auth/user-not-found')) {
      dispatch('snackbar/snackbarError', 'Something did not go right.', { root: true });
    }
  },

  loginMessagesSnackbar({ dispatch }, message) {
    if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'This email is not valid, please check that again.', { root: true });
    } else if (message.includes('auth/wrong-password')) {
      dispatch('snackbar/snackbarError', 'You password is incorrect , please try again.', { root: true });
    } else if (message.includes('auth/user-not-found')) {
      dispatch('snackbar/snackbarError', 'This account does not exist in our records.', { root: true });
    } else if (message.includes('auth/too-many-requests')) {
      dispatch('snackbar/snackbarError', 'Too many invalid attemps, please try again later..', { root: true });
    }
  },
};

const getters = {
  //* Checks if the user is authenticated.
  isLoggedIn: (auth.onAuthStateChanged, (auth) => !isEmpty(auth.user)),

  //* returns current user last login time.
  lastLogin: (state, getters) => (getters.isLoggedIn ? state.user.metadata.lastSignInTime : null),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
