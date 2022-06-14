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

// Vue will be mounted here.
let appMounted;

const profileLoaded = store.state.authentication.isProfileLoaded;

// Call mountVue to instanciate Vue.
function mountVue() {
  appMounted = new Vue({
    store,
    vuetify,
    router,
    render: (h) => h(App),
  }).$mount('#app');
}

// real-time authentication state.
// real-time profile snapShots.
// auto-closing listener on signOut.
auth.onAuthStateChanged(async (authenticatedUser) => {
  // mounts Vue excluding authentication information.
  // Stop the function right there.
  if (!appMounted && !authenticatedUser) {
    mountVue();
    return;
  }

  // Instanciate Vue only if the profile object is loaded
  // and vue isn't instanciated yet.
  store.watch(
    (state) => state.authentication.profile,
    (newProfile) => {
      if (!isEmpty(newProfile) && !appMounted) {
        mountVue();
      }
    },
  );

  let userProfile;
  let unSubscriveProfile;

  // If a persisted session exists.
  // Set the user and profile state.
  // Create real-time profile updates through a listener.
  if (authenticatedUser) {
    // Set active session user state.
    store.set('authentication/user', authenticatedUser);

    if (!profileLoaded) {
      // fetch the user profile.
      const { uid } = authenticatedUser;
      const docRef = doc(db, 'users', uid);
      const q = query(docRef);

      // create the listener, calling killListener() will destroy it,
      unSubscriveProfile = onSnapshot(q, (querySnap) => {
        console.log(querySnap);
        userProfile = querySnap.data();
        store.set('authentication/profile', userProfile);
        store.set('authentication/unSubscriveProfile', unSubscriveProfile);
      });
    }
    return;
  }

  // No authentixated user detected.
  // Kill the profile real-time data listener.
  store.state.authentication.unSubscriveProfile();

  // Clear user and profile objects.
  store.set('authentication/user', {});
  store.set('authentication/profile', {});
});
