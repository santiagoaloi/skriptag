// Utilities
import { make } from 'vuex-pathify';

const state = {};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  authMessagesSnackbar({ dispatch }, message) {
    if (message.includes('auth/invalid-email')) {
      dispatch('snackbar/snackbarError', 'This email is not valid, please try again.', { root: true });
      return;
    }

    if (message.includes('auth/wrong-password')) {
      dispatch('snackbar/snackbarError', 'Incorrect password , please try again.', { root: true });
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

    if (message.includes('auth/user-disabled')) {
      dispatch('snackbar/snackbarError', 'This account is disabled.', { root: true });
      return;
    }

    if (message.includes('auth/invalid-action-code')) {
      dispatch('snackbar/snackbarError', 'The recovery token is expired or already used before.', {
        root: true,
      });
      return;
    }

    if (message.includes('auth/weak-password')) {
      dispatch('snackbar/snackbarError', 'The password is to weak.', { root: true });
      return;
    }

    if (message.includes('auth/too-many-requests')) {
      dispatch(
        'snackbar/snackbarError',
        'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
        { root: true },
      );
      return;
    }

    if (message.includes('auth/email-already-in-use')) {
      dispatch('snackbar/snackbarError', 'Aother account is already using this email.', { root: true });
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
