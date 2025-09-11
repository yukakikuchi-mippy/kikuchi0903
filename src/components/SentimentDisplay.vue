<template>
  <!-- 感情スコアと絵文字を表示する -->
  <!-- 幅が狭いときは .narrow クラスを付与して縦並びに切り替える -->
  <span class="sentiment-display" :class="{ 'narrow': isNarrow }">
    <!-- スコアを小数点3桁で表示 -->
    <span class="score">{{ score.toFixed(3) }}</span>
    <!-- スコアに応じた顔文字を表示 -->
    <span class="emoji">{{ emoji }}</span>
  </span>
</template>

<script>
export default {
  props: {
    // 親から渡される感情スコア（必須）
    score: { type: Number, required: true }
  },
  data() {
    return {
      isNarrow: false // 画面幅が狭いかどうか
      // extraNarrow は checkWidth で代入してますが data に定義されていないので効いていません
      // 必要なら data に追加しましょう
    };
  },
  computed: {
    // スコアに応じて顔文字を返す
    emoji() {
      if (this.score > 0.2) return "😊"; // ポジティブ
      if (this.score < -0.2) return "😢"; // ネガティブ
      return "😐"; // ニュートラル
    }
  },
  mounted() {
    // 初回チェックとリサイズイベント登録
    this.checkWidth();
    window.addEventListener('resize', this.checkWidth);
  },
  beforeUnmount() {
    // コンポーネントが消えるときはイベントリスナーを外す
    window.removeEventListener('resize', this.checkWidth);
  },
  methods: {
    checkWidth() {
      const width = window.innerWidth;
      this.isNarrow = width <= 400; // 幅400px以下なら縦並び
      this.extraNarrow = width <= 250; // 250px以下のとき用 → CSS の @media でも対応済み
    }
  }
};
</script>

<style scoped>
/* デフォルトは横並び */
.sentiment-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 横並びのときはスコアと絵文字の間に余白 */
.sentiment-display .score {
  margin-right: 4px;
}

/* 400px以下：縦並び */
.sentiment-display.narrow {
  flex-direction: column;
}
.sentiment-display.narrow .score {
  margin-right: 0;
  margin-bottom: 2px;
}

/* 250px以下：さらに文字サイズを小さくして縦幅を節約 */
@media (max-width: 250px) {
  .sentiment-display.narrow .score,
  .sentiment-display.narrow .emoji {
    font-size: 0.85em;
  }
}
</style>
