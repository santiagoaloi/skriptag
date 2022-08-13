// Utilities
import { make } from 'vuex-pathify';

const state = {
  authLoader: false,
  signupLoader: false,
  signInWithGoogle: false,
  signInWithGithub: false,
  resendVerificationLoader: false,
  verificationInProgressLoader: false,
  removeAccountLoader: false,
  routeLoader: false,
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
