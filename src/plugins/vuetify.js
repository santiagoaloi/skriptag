import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.teal.base,
      },
    },
  },
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
});
