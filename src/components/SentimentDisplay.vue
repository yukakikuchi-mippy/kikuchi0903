<template>
  <span class="sentiment-display" :class="{ 'narrow': isNarrow }">
    <span class="score">{{ score.toFixed(3) }}</span>
    <span class="emoji">{{ emoji }}</span>
  </span>
</template>

<script>
export default {
  props: {
    score: { type: Number, required: true }
  },
  data() {
    return {
      isNarrow: false
    };
  },
  computed: {
    emoji() {
      if (this.score > 0.2) return "😊";
      if (this.score < -0.2) return "😢";
      return "😐";
    }
  },
  mounted() {
    this.checkWidth();
    window.addEventListener('resize', this.checkWidth);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkWidth);
  },
  methods: {
    checkWidth() {
      // 400px以下で改行、250px以下でさらに縦幅を確保
      const width = window.innerWidth;
      this.isNarrow = width <= 400;
      this.extraNarrow = width <= 250;
    }
  }
};
</script>

<style scoped>
.sentiment-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* PCや十分な幅の場合 */
.sentiment-display .score {
  margin-right: 4px;
}
.sentiment-display .emoji {
  display: inline-block;
}

/* 画面幅400px以下：縦並び */
.sentiment-display.narrow {
  flex-direction: column;
}
.sentiment-display.narrow .score {
  margin-right: 0;
  margin-bottom: 2px;
}

/* 超小型スマホ250px以下：文字サイズ小さくして縦幅確保 */
@media (max-width: 250px) {
  .sentiment-display.narrow .score,
  .sentiment-display.narrow .emoji {
    font-size: 0.85em;
  }
}
</style>
