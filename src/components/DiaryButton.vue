<template>
  <v-btn text color="white" to="/diary" tag="router-link" :small="small">
    日記投稿
  </v-btn>
</template>

<script>
export default {
  name: "DiaryButton",
};
</script>

<style scoped>
::v-deep(.v-btn__content) {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
</style>
