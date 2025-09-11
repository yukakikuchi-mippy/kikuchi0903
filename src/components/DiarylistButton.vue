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
