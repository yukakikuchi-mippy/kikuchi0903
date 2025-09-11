<template>
  <v-btn text color="white" to="/diarylist" tag="router-link" :small="small">
    日記一覧
  </v-btn>
</template>

<script>
// 日記投稿ボタンとおんなじような感じ
export default {
  name: "DiarylistButton",
};
</script>

<style scoped>
::v-deep(.v-btn__content) {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
</style>

