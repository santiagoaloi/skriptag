// Utilities
import { make } from 'vuex-pathify';

const state = {
  authLoader: false,
  signupLoader: false,
  resendVerificationLoader: false,
  verificationInProgressLoader: false,
  removeAccountLoader: false,
  disableAccountLoader: false,
  deleteAccountLoader: false,
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
