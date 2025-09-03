<template>
  <span class="sentiment-display">
    <span class="score">{{ score.toFixed(3) }}</span>
    <span class="emoji">{{ emoji }}</span>
  </span>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  computed: {
    emoji() {
      if (this.score > 0.2) return "😊";
      if (this.score < -0.2) return "😢";
      return "😐";
    },
  },
};
</script>

<style scoped>
.score {
  font-weight: normal; /* ラベルの太字と区別 */
  margin-right: 4px;
}
.emoji {
  margin-left: 2px;
}
</style>
