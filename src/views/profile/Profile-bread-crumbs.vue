<template>
  <div class="d-flex align-center link-color">
    <span class="mb-6 mt-3 cursor-pointer underlineHover bread" @click="$router.push({ name: 'skriptag-settings' })"
      >Profile</span
    >
    <v-icon v-once class="mt-n2 grey--text text--darken-1 mt-n3" size="18 " dark> $mdiSlashForward</v-icon>
    <span class="mb-6 mt-3 cursor-pointer underlineHover bread" @click="$router.push({ name: 'profile-settings' })"
      >Settings</span
    >
    <v-icon v-if="$route.meta.title" v-once class="mt-n2 grey--text text--darken-1 mt-n3" size="18 " dark>
      $mdiSlashForward</v-icon
    >

    <span class="mb-6 mt-3 underlineHover bread pointer-events-none">{{ $route.meta.title }}</span>
  </div>
</template>
<script>
  export default {
    name: 'ProfileBreadCrumbs',
  };
</script>
