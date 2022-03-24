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
    const { email, password } = state.loginForm;

    if (!state.loginForm.email || !state.loginForm.password) {
      dispatch('snackbar/snackbarError', 'You have to provide both an email and password.', { root: true });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          store.set('authentication/user', userCredential.user);
        })
        .catch(({ ...error }) => {
          switch (error.code) {
            case 'auth/invalid-email':
              dispatch('snackbar/snackbarError', 'Your email is not valid, please check that again.', { root: true });
              break;

            case 'auth/wrong-password':
              dispatch('snackbar/snackbarError', 'Invalid credentials , please try again.', { root: true });
              break;

            case 'auth/user-not-found':
              dispatch('snackbar/snackbarError', 'The account does not exist in our records.', { root: true });
              break;

            default:
              dispatch('snackbar/snackbarError', 'Something went wrong...', { root: true });
          }
        });
    }
  },
};

const getters = {
  //* Checks if the user is authenticated.
  isLoggedIn: (onAuthStateChanged, (Obj) => !isEmpty(Obj.user)),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
