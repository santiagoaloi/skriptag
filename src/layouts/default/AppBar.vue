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
          Why you
          <template #items>
            <vs-navbar-item id="guide"> Guide </vs-navbar-item>
            <vs-navbar-item id="docs"> Documents </vs-navbar-item>
            <vs-navbar-item id="components"> Components </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-group>
          Flush your stress
          <template #items>
            <vs-navbar-item id="Github"> Github </vs-navbar-item>
            <vs-navbar-item id="Discord"> Discord </vs-navbar-item>
            <vs-navbar-item id="Twitter"> Twitter </vs-navbar-item>
            <vs-navbar-item id="Medium"> Medium </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-item id="blog" :active="active == 'blog'"> Blog </vs-navbar-item>
      </template>

      <template #right>
        <!-- <vs-select v-model="dropdown" placeholder="Select" @click.stop>
            <vs-option label="Vuesax" value="1"> Vuesax </vs-option>
            <vs-option label="Vue" value="2"> Vue </vs-option>
            <vs-option label="Javascript" value="3"> Javascript </vs-option>
            <vs-option disabled label="Sass" value="4"> Sass </vs-option>
            <vs-option label="Typescript" value="5"> Typescript </vs-option>
            <vs-option label="Webpack" value="6"> Webpack </vs-option>
            <vs-option label="Nodejs" value="7"> Nodejs </vs-option>
          </vs-select> -->

        <v-scale-transition>
          <v-btn v-if="isLoggedIn" style="position: fixed" :ripple="false" color="black white--text" @click="logout">
            {{ `Logout ${firstAndShortLast}` }}
          </v-btn>
        </v-scale-transition>

        <template v-if="!isLoggedIn">
          <BaseButton
            v-for="button in [
              { name: 'login', icon: 'account-arrow-right' },
              { name: 'signup', icon: 'account-plus' },
            ]"
            :key="button.name"
            dark
            color="grey darken-3"
            class="ml-3"
            @click="$router.push(`${button.name}`)"
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
    },

    methods: {
      ...call('authentication/*'),

      auth() {
        this.login().then(() => {
          this.$emit('logged-in', 'loginSlide');
        });
      },
    },
  };
</script>
<style scoped>
  ::v-deep .vs-select__input:hover {
    box-shadow: unset;
    -webkit-transform: unset;
    transform: unset;
  }

  ::v-deep .vs-select.activeOptions .vs-select__input {
    -webkit-transform: unset;
    transform: unset;
  }
</style>
