<template>
  <div>
    <profileBanner />
    <v-card-text class="px-8">
      <profileBreadCrumbs />

      <v-fade-transition css mode="out-in">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <router-view v-else />
      </v-fade-transition>
    </v-card-text>
  </div>
</template>
<script>
  import profileBanner from './Profile-banner';
  import profileBreadCrumbs from './Profile-bread-crumbs';

  export default {
    name: 'ProfileView',
    components: {
      profileBanner,
      profileBreadCrumbs,
    },
  };
</script>
