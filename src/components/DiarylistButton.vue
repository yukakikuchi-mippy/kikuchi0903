<template>
  <v-btn text color="white" to="/diarylist" tag="router-link" :small="small">
    日記一覧
  </v-btn>
</template>

<script>
export default {
  name: "DiarylistButton",
  props: {
    small: { type: Boolean, default: false }
  },
};
</script>
