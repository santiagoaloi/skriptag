<template>
  <v-row no-gutters>
    <v-col :order="right && !$vuetify.breakpoint.xs ? '12' : '-1'" cols="12" sm="6">
      <v-img
        gradient="to bottom , rgba(20,20,20, .4) 40%,  rgba(0,0,0,.8) 160%"
        width="100%"
        :style="$vuetify.breakpoint.xs ? 'height:35vh' : 'height: calc(100vh - 60px);'"
        :src="`https://picsum.photos/1280/800?${Date.now().toString().slice(0, 1)}`"
      >
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col cols="12" style="color: #ccc" sm="6">
      <v-container style="color: #ccc" class="fill-height">
        <v-fade-transition>
          <v-sheet
            style="color: #ccc"
            min-height="50vh"
            class="d-flex flex-colum align-center transparent"
            :class="$vuetify.breakpoint.xs ? 'px-5' : 'px-16'"
          >
            <slot></slot>
          </v-sheet>
        </v-fade-transition>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
  // Utilities
  import { sync } from 'vuex-pathify';

  export default {
    name: 'BaseSplit2',
    props: {
      right: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      snackbar: sync('snackbar'),
    },
  };
</script>
