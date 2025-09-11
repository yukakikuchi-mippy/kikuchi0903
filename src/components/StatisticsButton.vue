<template>
  <v-btn text color="white" to="/statistics" tag="router-link">
    統計
  </v-btn>
</template>

<script>
// 日記投稿ボタンとおんなじような感じ
export default {
  name: "StatisticsButton",
};
</script>

<style scoped>
::v-deep(.v-btn__content) {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
</style>

