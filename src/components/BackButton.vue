<template>
  <v-btn color="primary" outlined @click="goBack">
    <slot>← 戻る</slot>
  </v-btn>
</template>

<script>
export default {
  name: "BackButton", // コンポーネント名
  props: {
    to: {
      type: [String, Object],
      default: null
    }
  },
  methods: {
    // ボタンがクリックされたときの処理
    goBack() {
      if (this.to) {
        // to が指定されていれば、そのルートに遷移
        this.$router.push(this.to);
      } else {
        this.$router.back(); // 前の画面に戻る
      }
    }
  }
};
</script>
