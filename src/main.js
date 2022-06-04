import Vue from 'vue';
import Vuesax from 'vuesax';
import { doc, onSnapshot, query } from 'firebase/firestore';
import { isEmpty } from 'lodash';
import { auth, db } from '@/firebase/firebase';
import App from './App.vue';
import router from './router';
import { store } from '@/store';
import vuetify from './plugins/vuetify';
import './plugins';
// Styles amd Animations
// import 'aos/dist/aos.css';
import './assets/css/style.css';
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

Vue.directive('animation', {
  bind(el, binding) {
    const validAnimations = ['shrink'];
    const { link, longPress } = binding.value || {};

    if (validAnimations.includes(binding.arg) && link) {
      const timeout = '0.3s';

      el.onmousedown = () => {
        el.style.transform = 'scale(0.95)';
        el.style.transition = timeout;

        if (!longPress) {
          setTimeout(() => {
            el.style.transform = 'scale(1)';
          }, 300);
        }
      };

      if (longPress) {
        const lpTimeout = '0.6s';

        el.onmouseout = () => {
          el.style.transform = 'scale(1)';
          el.style.transition = lpTimeout;
        };
        el.onmouseup = () => {
          el.style.transform = 'scale(1)';
          el.style.transition = lpTimeout;
        };
      }
    }
  },
});

let app;

// Call this function to instanciate Vue.
function mountVue() {
  app = new Vue({
    vuetify,
    store,
    router,
    render: (h) => h(App),
  }).$mount('#app');
}

// real-time authentication state.
// real-time profile snapShots.
// auto-closing listener on signOut.
auth.onAuthStateChanged(async (currentUser) => {
  // mounts Vue excluding authentication features.
  // Stop the function right here.
  if (!app && !currentUser) {
    mountVue();
    return;
  }

  let userProfile;
  let killListener;

  //  If a persisted session exists.
  // Set the user and profile state.
  //  Create real-time profile updates through a listener.
  if (currentUser) {
    // Set active session user state.
    store.set('authentication/user', currentUser ?? {});

    // fetch the user profile,
    const { uid } = currentUser;
    const docRef = doc(db, 'users', uid);
    const q = query(docRef);

    // create the listener, calling killListener() will destroy it,
    killListener = onSnapshot(q, (querySnap) => {
      userProfile = querySnap.data();
      store.set('authentication/profile', userProfile);
    });

    // Store the listnener in state, can be called on signOut.
    store.set('authentication/unSubscriveProfile', killListener);
  }

  // Instanciate Vue only if the user and profile objects are set.
  // The wather here is acting like a computed prop.
  store.watch(
    (state) => state.authentication.profile,
    (newProfile) => {
      if (!isEmpty(newProfile) && !app) {
        mountVue();
      }
    },
  );
});
