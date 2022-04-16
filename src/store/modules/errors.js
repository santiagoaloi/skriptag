// Utilities
import { make } from 'vuex-pathify';

const state = {
  authLoader: false,
  signupLoader: false,
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  authMessagesSnackbar({ dispatch }, message) {
    if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'This email is not valid, please check that again.', { root: true });
      return;
    }
    if (message.includes('auth/wrong-password')) {
      dispatch('snackbar/snackbarError', 'You password is incorrect , please try again.', { root: true });
      return;
    }
    if (message.includes('auth/user-not-found')) {
      dispatch('snackbar/snackbarError', 'This account does not exist in our records.', { root: true });
      return;
    }
    if (message.includes('auth/too-many-attempts')) {
      dispatch('snackbar/snackbarError', 'Too many invalid attemps, please try again later.', { root: true });
      return;
    }

    dispatch('snackbar/snackbarError', 'something went wrong.', { root: true });
  },

  signupMessagesSnackbar({ dispatch }, message) {
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
      dispatch('snackbar/snackbarError', 'This email is already in use with another account. Pick another email. ', {
        root: true,
      });
      return;
    }

    dispatch('snackbar/snackbarError', 'something went wrong.', { root: true });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
