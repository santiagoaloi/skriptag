// Utilities
import { make } from 'vuex-pathify';
import { store } from '@/store';

const state = {
  data: {
    color: 'success',
    text: '',
    icon: '',
    value: false,
    permanent: false,
  },
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  snackbarSuccess(_, message) {
    const payload = { value: true, text: message, color: 'grey darken-2', icon: 'mdi-check' };
    store.set('snackbar/data', { ...payload });
  },

  snackbarError(_, message) {
    const payload = {
      value: true,
      text: message,
      color: 'pink darken-1',
      icon: 'mdi-alert-octagon',
    };

    store.set('snackbar/data', payload);
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
