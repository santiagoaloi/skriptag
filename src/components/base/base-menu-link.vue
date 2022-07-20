<template>
  <h4 v-disabled="link.disabled" class="basic-link" v-on="$listeners" @click="link.to && goToUrl()">
    <v-icon v-if="icon" left small dark>{{ icon }}</v-icon>
    {{ link.name }}
  </h4>
</template>

<script>
  export default {
    name: 'BaseMenuLink',
    props: {
      link: {
        type: Object,
        default: () => {},
      },
    },

    methods: {
      goToUrl() {
        if (this.link.external) {
          window.location.href = this.link.to;
          return;
        }

        this.$router.push(this.link.to);
      },
    },
  };
</script>
<style scoped>
  .basic-link {
    cursor: pointer;
    color: rgb(155, 155, 155) !important;
    transition: 1s;
    cursor: pointer;
  }

  .basic-link:hover {
    color: rgb(227, 227, 227) !important;
    transition: 1s;
  }
</style>
