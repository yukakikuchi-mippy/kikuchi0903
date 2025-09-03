<template>
  <v-btn color="primary" outlined @click="goBack">
    <slot>← 戻る</slot>
  </v-btn>
</template>

<script>
export default {
  name: "BackButton",
  props: {
    to: {
      type: [String, Object],
      default: null
    }
  },
  methods: {
    goBack() {
      if (this.to) {
        this.$router.push(this.to);
      } else {
        this.$router.back(); // 前の画面に戻る
      }
    }
  }
};
</script>
