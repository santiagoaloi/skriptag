<template>
  <v-btn
    v-animation:shrink="{ link: true, longPress: true }"
    style="color: #ccc"
    v-bind="$attrs"
    :ripple="false"
    large
    v-on="$listeners"
  >
    <slot
  /></v-btn>
</template>

<script>
  export default {
    name: 'BaseButton',
  };
</script>
