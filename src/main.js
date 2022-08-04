import Vue from 'vue';
import Vuesax from 'vuesax';
import { doc, onSnapshot, query } from 'firebase/firestore';

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

Vue.directive('disabled', {
  bind(el, binding) {
    const { value } = binding;
    if (value) el.style['pointer-events'] = 'none';
  },
});

Vue.directive('debounce', {
  bind(el, binding) {
    const { ms } = binding.value;
    console.log(el);
    el.style.cssText = 'display:none !important';
    setTimeout(() => {
      el.style.display = 'unset';
      el.setAttribute('key', 327843);
    }, ms);
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
let userProfile;
let unSubscriveProfile;

function setProfile() {
  store.set('authentication/profile', userProfile);
  store.set('authentication/unSubscriveProfile', unSubscriveProfile);
}

// instanciate Vue
function mountVue() {
  appMounted = new Vue({
    store,
    vuetify,
    router,
    render: (h) => h(App),
  }).$mount('#app');
}

async function loadProfile(authenticatedUser) {
  return new Promise((resolve) => {
    // fetch the user profile.
    const { uid } = authenticatedUser;
    const docRef = doc(db, 'users', uid);
    const q = query(docRef);

    // create the listener, calling killListener() will destroy it,
    unSubscriveProfile = onSnapshot(
      q,

      (snapshot) => {
        userProfile = snapshot.data();
        setProfile();
        resolve(true);
      },
      (error) => {
        store.dispatch(
          'snackbar/snackbarError',
          `We are having trouble loading your account profile, please contact support to resolve this issue.`,
          { root: true },
        );
        store.dispatch('authentication/logout');
      },
    );
  });
}

auth.onAuthStateChanged(async (authenticatedUser) => {
  store.set('authentication/user', authenticatedUser);

  if (authenticatedUser) {
    const profileLoaded = await loadProfile(authenticatedUser);

    if (!appMounted && profileLoaded) {
      mountVue();
      console.log('mounting Vue');
    }
    return;
  }

  if (!appMounted && !authenticatedUser) {
    mountVue();
    console.log('mounting Vue');
  }
});
