import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import minifyTheme from 'minify-css-string';
import { icons } from './icons';

Vue.use(Vuetify);

export default new Vuetify({
  icons,
  theme: {
    options: {
      minifyTheme,
      variations: false,
    },
  },
});
