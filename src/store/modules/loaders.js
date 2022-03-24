// Utilities
import { make } from 'vuex-pathify';

const state = {
  data: {
    authentication: false,
  },
};

const mutations = make.mutations(state);
const actions = {};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
