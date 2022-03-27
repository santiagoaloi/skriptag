import Vue from 'vue';
import Vuesax from 'vuesax';
import AOS from 'aos';
import App from './App.vue';
import router from './router';
import { store } from '@/store';
import vuetify from './plugins/vuetify';
import './plugins';
import 'vuesax/dist/vuesax.css';

// Styles amd Animations
import 'aos/dist/aos.css';

// require('dotenv').config();

Vue.config.productionTip = false;
// Vuesax styles
Vue.use(Vuesax, {
  colors: {
    primary: '#26A69A',
    success: '#00897B',
    danger: 'rgb(242, 19, 93)',
    warning: 'rgb(255, 130, 0)',
    background: '#23272d',
  },
});

Vue.config.productionTip = false;

new Vue({
  created() {
    AOS.init();
  },
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
