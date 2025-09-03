<template>
  <v-btn text color="white" to="/diary" tag="router-link" :small="small">
    日記投稿
  </v-btn>
</template>

<script>
export default {
  name: "DiaryButton",
  props: {
    small: { type: Boolean, default: false }
  }
};
</script>
