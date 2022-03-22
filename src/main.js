import Vue from 'vue';
import Vuesax from 'vuesax';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins';

import 'vuesax/dist/vuesax.css';

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
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
