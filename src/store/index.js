// Vue
import Vue from 'vue';
import Vuex from 'vuex';

// libraries
import VuexPersist from 'vuex-persist';
import localforage from 'localforage';
import pathify from '@/plugins/vuex-pathify';

// All Vuex Modules definned in ./modules/index.js
import * as modules from './modules';

Vue.use(Vuex);

const vuexLocal = new VuexPersist({
  key: 'vuex-store',
  storage: localforage,
  asyncStorage: true,

  // Specifies which modules or module variables should be persisted.
  reducer: (state) => ({
    app: {
      ...state.app,
    },
  }),
});

export const store = new Vuex.Store({
  modules,
  plugins: [pathify.plugin, vuexLocal.plugin],
});
