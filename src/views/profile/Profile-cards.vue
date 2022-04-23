<template>
  <div>
    <base-no-split v-if="!switchToCardSettings">
      <template #left>
        <v-row>
          <v-col cols="12" sm="6" md="2">
            <vs-card class="my-card" @click="switchCard('ProfileEdit')">
              <template #title>
                <h3>Profile Details</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Edit your profile information such as your names, tags,and more...</p>
              </template>
            </vs-card>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <vs-card class="my-card" @click="switchCard('AccountEdit')">
              <template #title>
                <h3>Account settings</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Change your authentication settings,account email, 2FA, remove or disable your account.</p>
              </template>
            </vs-card>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <vs-card :disabled="!verified" :class="{ 'disabled-card': !verified }" class="my-card">
              <template #title>
                <h3>Billing information</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Change your authentication settings,account email, 2FA, remove or disable your account.</p>
              </template>
            </vs-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <vs-card
              :disabled="!verified"
              :class="{ 'disabled-card': !verified }"
              class="my-card"
              @click="switchCard('SkriptagEdit')"
            >
              <template #title>
                <h3>Manage Skriptag</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Manage users, roles, and project settings.</p>
              </template>
            </vs-card>
          </v-col>

          <!-- <v-col cols="12" sm="6" md="3">
            <vs-card :class="{ 'disabled-card': !verified }" class="my-card">
              <template #title>
                <h3>Your purchased items</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Change your authentication settings,account email, 2FA, remove or disable your account.</p>
              </template>
            </vs-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <vs-card :class="{ 'disabled-card': !verified }" class="my-card">
              <template #title>
                <h3>Blog posts</h3>
              </template>
              <template #img>
                <img :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`" alt="" />
              </template>
              <template #text>
                <p>Change your authentication settings,account email, 2FA, remove or disable your account.</p>
              </template>
            </vs-card>
          </v-col> -->
        </v-row>
      </template>
    </base-no-split>
    <v-fade-transition hide-on-leave>
      <v-card-text v-if="switchToCardSettings" class="px-8">
        <component :is="activeCard" @close="close()" />
      </v-card-text>
    </v-fade-transition>
  </div>
</template>

<script>
  import { get } from 'vuex-pathify';
  import ProfileEdit from './Profile-edit';
  import AccountEdit from './Account-edit';
  import SkriptagEdit from './Skriptag-edit';

  export default {
    name: 'ProfileItems',
    components: {
      ProfileEdit,
      AccountEdit,
      SkriptagEdit,
    },
    data() {
      return {
        switchToCardSettings: false,
        activeCard: null,
      };
    },

    computed: {
      ...get('authentication', ['verified']),
    },
    methods: {
      switchCard(card) {
        this.switchToCardSettings = true;
        this.activeCard = card;
      },

      close() {
        this.switchToCardSettings = false;
        this.activeCard = null;
      },
    },
  };
</script>
<style>
  .disabled-card {
    pointer-events: none;
  }
  .my-card .vs-card {
    width: auto !important;
    height: 100% !important;

    max-width: unset !important;
    max-height: unset !important;
  }

  .my-card .vs-card:hover {
    opacity: 0.9;
  }

  .vs-card-content {
    height: 100% !important;
  }
</style>
