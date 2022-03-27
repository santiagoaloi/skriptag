// Utilities
import { make } from 'vuex-pathify';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { isEmpty } from 'lodash';
import { store } from '@/store';
import { auth, onAuthStateChanged } from '@/plugins/firebase';

const state = {
  user: {},
  loginForm: {},
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  async logout({ dispatch, getters }) {
    if (getters.isLoggedIn) {
      await signOut(auth);
      store.set('authentication/user', {});
      dispatch('snackbar/snackbarSuccess', 'Hope to see you soon again!', { root: true });
    }
  },

  async fetchUser() {
    auth.onAuthStateChanged(async (user) => {
      store.set('authentication/user', !user ? {} : user);
    });
  },

  login({ dispatch, state }) {
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
        })
        .catch(({ ...error }) => {
          dispatch('loginMessagesSnackbar', error.code);
        });
    }
  },

  loginMessagesSnackbar({ dispatch }, message) {
    if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'This email is not valid, please check that again.', { root: true });
      store.set('loaders/authLoader', false);
    } else if (message.includes('auth/wrong-password')) {
      dispatch('snackbar/snackbarError', 'You password is incorrect , please try again.', { root: true });
      store.set('loaders/authLoader', false);
    } else if (message.includes('auth/user-not-found')) {
      dispatch('snackbar/snackbarError', 'This account does not exist in our records.', { root: true });
      store.set('loaders/authLoader', false);
    } else if (message.includes('auth/too-many-requests')) {
      dispatch('snackbar/snackbarError', 'Too many invalid attemps, please try again later..', { root: true });
      store.set('loaders/authLoader', false);
    }
  },
};

const getters = {
  //* Checks if the user is authenticated.
  isLoggedIn: (onAuthStateChanged, (UserObject) => !isEmpty(UserObject.user)),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
