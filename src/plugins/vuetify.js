import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';
import { icons } from './icons';

Vue.use(Vuetify);

export default new Vuetify({
  icons,
  theme: {
    themes: {
      light: {
        primary: colors.teal.base,
      },
    },
  },
});
