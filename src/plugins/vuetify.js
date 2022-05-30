import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';
import { icons } from './icons';

Vue.use(Vuetify);

export default new Vuetify({
  icons,
  theme: {
    options: {
      minifyTheme: process.env.NODE_ENV === 'development' ? require('minify-css-string').default : undefined,
      variations: false,
    },
    themes: {
      light: {
        primary: colors.teal.base,
      },
    },
  },
});
