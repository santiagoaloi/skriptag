<template>
  <v-app-bar flat height="60" color="transparent" app>
    <vs-navbar v-model="active" style="position: relative" fixed shadow square>
      <template #left>
        <div>
          <v-container>
            <skriptag-title link small @click="$router.push('/')" />
          </v-container>
        </div>
      </template>

      <template v-if="!$vuetify.breakpoint.xs">
        <vs-navbar-group>
          Downloads
          <template #items>
            <vs-navbar-item id="guide"> Templates </vs-navbar-item>
            <vs-navbar-item id="docs"> Freebies </vs-navbar-item>
            <vs-navbar-item id="components"> Courses </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-group>
          Tutorials
          <template #items>
            <vs-navbar-item id="Github"> Firebase </vs-navbar-item>
            <vs-navbar-item id="Discord"> VueJS </vs-navbar-item>
            <vs-navbar-item id="Twitter"> Vuetify </vs-navbar-item>
            <vs-navbar-item id="Medium"> Javascript </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-item id="blog" :active="active == 'blog'"> Blog </vs-navbar-item>
      </template>

      <template #right>
        <v-scale-transition>
          <v-btn
            v-if="isLoggedIn && !$vuetify.breakpoint.smAndDown"
            class="mr-3"
            :ripple="false"
            dark
            color="#2a3143"
            @click="logout"
          >
            {{ `Logout ${firstAndShortLast || profile.email}` }}
          </v-btn>
        </v-scale-transition>

        <v-scale-transition>
          <v-burger v-if="$vuetify.breakpoint.smAndDown" :active="mobileMenu" type="spring" @updated="mobileMenu = !mobileMenu" />
        </v-scale-transition>

        <template v-if="!isLoggedIn && !$vuetify.breakpoint.smAndDown">
          <BaseButton
            v-for="button in [
              { link: 'login', name: 'Login', icon: 'account-arrow-right' },
              { link: 'signup', name: 'Sign up', icon: 'account-plus' },
            ]"
            :key="button.name"
            dark
            color="grey darken-3"
            class="ml-3"
            @click="$router.push(`${button.link}`)"
          >
            <v-icon left> mdi-{{ button.icon }}</v-icon
            >{{ button.name }}
          </BaseButton>
        </template>
      </template>
    </vs-navbar>
  </v-app-bar>
</template>

<script>
  // Utilities
  import { sync, get, call } from 'vuex-pathify';

  export default {
    name: 'DefaultAppBar',
    data() {
      return {
        dropdown: [],
        active: '',
      };
    },

    computed: {
      drawer: sync('app/drawer'),
      ...get('authentication', ['isLoggedIn', 'profile', 'firstAndShortLast']),
      ...sync('app', ['mobileMenu']),
    },

    methods: {
      ...call('authentication', ['logout']),

      auth() {
        this.login().then(() => {
          this.$emit('logged-in', 'loginSlide');
        });
      },
    },
  };
</script>
<style>
  ::v-deep .vs-select__input:hover {
    box-shadow: unset;
    -webkit-transform: unset;
    transform: unset;
  }

  ::v-deep .vs-select.activeOptions .vs-select__input {
    -webkit-transform: unset;
    transform: unset;
  }

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
</style>
