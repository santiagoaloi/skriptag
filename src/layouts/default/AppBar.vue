<template>
  <v-app-bar class="border-bottom" height="50" color="#22272d" absolute flat dark app>
    <skriptag-title
      v-if="!$route.meta.requiresAuth"
      class="overflow-visible cursor-pointer"
      :class="{ 'ml-2 ': !$vuetify.breakpoint.smAndDown }"
      link
      small
      @click.native="$router.push('/')"
    />

    <v-spacer></v-spacer>

    <div v-for="item in menuItems" :key="item.name" class="pr-8">
      <BaseMenuLink>{{ item.name }}</BaseMenuLink>
    </div>

    <!-- <div class="pr-8">
      <h4>Templates</h4>
    </div>
    <div class="pr-8">
      <h4>Blog</h4>
    </div> -->

    <template v-if="!isLoggedIn && !$vuetify.breakpoint.smAndDown">
      <BaseButton
        v-for="button in [
          { link: 'login', name: 'Login', icon: '$mdiAccountArrowRight' },
          { link: 'signup', name: 'Sign up', icon: '$mdiAccountPlus' },
        ]"
        :key="button.name"
        :disabled="$route.name === button.link"
        dark
        class="ml-3"
        @click="!$router.push(`${button.link}`)"
      >
        <v-icon left> {{ button.icon }}</v-icon
        >{{ button.name }}
      </BaseButton>
    </template>

    <template v-if="profile">
      <BaseButton v-if="!$vuetify.breakpoint.smAndDown" key="btn1" @click="logout">
        <v-icon left class="mr-2" small>$mdiLogoutVariant</v-icon>{{ `Logout ${firstAndShortLast || ''}` }}
      </BaseButton>
      <BaseButton
        v-if="!$vuetify.breakpoint.smAndDown && !$route.meta.requiresAuth"
        key="btn2"
        class="ml-3"
        @click="$router.push('/profile')"
      >
        <v-icon left class="mr-2" small>$mdiConsole</v-icon> Console
      </BaseButton>
    </template>

    <v-burger v-if="$vuetify.breakpoint.smAndDown" :active="mobileMenu" type="spring" @updated="mobileMenu = !mobileMenu" />
  </v-app-bar>
</template>

<script>
  import { sync, get, call } from 'vuex-pathify';

  export default {
    name: 'DefaultAppBar',

    data() {
      return {
        dropdown: [],
        active: '',
        menuItems: [
          { name: 'Consulting', to: 'https://calendly.com/santiagoaloi/20min', disabled: false, external: true },
          { name: 'Templates', to: '', disabled: false, external: false },
          { name: 'Blog', to: '', disabled: false, external: false },
        ],
      };
    },

    computed: {
      drawer: sync('app/drawer'),
      ...get('authentication', ['isLoggedIn', 'profile', 'firstAndShortLast']),
      ...sync('app', ['mobileMenu']),
    },

    methods: {
      ...call('authentication', ['logout']),
    },
  };
</script>
<style scoped>
  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    background-color: white;
  }

  .hamburger.is-active .hamburger-inner,
  .hamburger.is-active .hamburger-inner::before,
  .hamburger.is-active .hamburger-inner::after {
    background-color: white;
  }

  .border-bottom {
    border-bottom: solid 1px #444c56 !important;
  }
</style>
