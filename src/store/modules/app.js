// Pathify
import { make } from 'vuex-pathify';

// Data
const state = {
  drawer: true,
  profileBanner: true,
  mobileMenu: false,
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  // Reusable timeout function, resolves when time's up.
  sleep(_, ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
