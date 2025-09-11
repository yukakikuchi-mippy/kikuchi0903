<template>
  <v-container class="pa-4" max-width="900">
    <v-row>
      <v-col>
        <h1>日記詳細</h1>
        <!-- 日記データが取得できたとき -->
       <v-card v-if="diary" class="pa-4" style="position: relative;">
  <!-- 右上にお気に入りボタン -->
  <div class="favorite-btn-wrapper">
    <FavoriteButton
      :diaryId="diary.diary_id"
      :initialFavorite="diary.is_favorite"
      @update="val => diary.is_favorite = val"
    />
  </div>


   <!-- 日記詳細情報 -->
  <p><strong>作成日:</strong> {{ formatDate(diary.created_at_jst) }}</p>
  <p><strong>本文:</strong> {{ diary.text }}</p>
  <p><strong>AIコメント:</strong> {{ diary.ai_text }}</p>
  <p><strong>感情スコア:</strong> <SentimentDisplay :score="diary.sentiment" /></p>

  <v-divider class="my-2"></v-divider>

   <!-- 感情スコア詳細 -->
  <h3>詳細スコア</h3>
  <ul>
    <li>😊 Positive: {{ diary.positive_score?.toFixed(3) }}</li>
    <li>😐 Neutral: {{ diary.neutral_score?.toFixed(3) }}</li>
    <li>😢 Negative: {{ diary.negative_score?.toFixed(3) }}</li>
  </ul>

  <!-- スコアを横棒グラフに -->
<div style="margin-top: 8px; display: flex; height: 20px; width: 100%; border-radius: 10px; overflow: hidden;">
  <!-- Positive -->
  <div
    v-if="diary.positive_score > 0"
    :style="{
      width: (diary.positive_score * 100) + '%',
      backgroundColor: '#54917f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      borderTopRightRadius: isLast('positive') ? '10px' : '0',
      borderBottomRightRadius: isLast('positive') ? '10px' : '0'
    }"
  >
    {{ (diary.positive_score * 100).toFixed(0) }}%
  </div>

  <!-- Neutral -->
  <div
    v-if="diary.neutral_score > 0"
    :style="{
      width: (diary.neutral_score * 100) + '%',
      backgroundColor: '#8da0b6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      borderTopRightRadius: isLast('neutral') ? '10px' : '0',
      borderBottomRightRadius: isLast('neutral') ? '10px' : '0'
    }"
  >
    {{ (diary.neutral_score * 100).toFixed(0) }}%
  </div>

  <!-- Negative -->
  <div
    v-if="diary.negative_score > 0"
    :style="{
      width: (diary.negative_score * 100) + '%',
      backgroundColor: '#e95464',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      borderTopRightRadius: isLast('negative') ? '10px' : '0',
      borderBottomRightRadius: isLast('negative') ? '10px' : '0'
    }"
  >
    {{ (diary.negative_score * 100).toFixed(0) }}%
  </div>
</div>
<!-- 戻るボタン -->
<v-card-actions class="justify-end">
    <BackButton />
  </v-card-actions>

</v-card>
<!-- エラー時の表示 -->
        <v-alert v-else-if="error" type="error" outlined>{{ error }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import FavoriteButton from "@/components/FavoriteButton.vue";
import SentimentDisplay from "@/components/SentimentDisplay.vue";
import BackButton from "@/components/BackButton.vue";

export default {
  name: "DiaryDetailView",
  components: {
    FavoriteButton,
    SentimentDisplay,
    BackButton
  },
  props: ["id"], //日記ID
  data() {
    return {
      diary: null, // 取得した日記データ
      error: null, // エラーメッセージ

    };
  },
  async mounted() {
    // コンポーネントが表示されたときに日記詳細を取得
  try {
    const userId = this.$store.state.userId; // 一覧と同じくユーザーIDを付与
    const res = await axios.get(
      "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/detail?",
      { params: { userId, diaryId: this.id } }
    );
    this.diary = res.data;
  } catch (err) {
    console.error(err);
    this.error = "詳細データの取得に失敗しました";
  }
},

  methods: {
    // 日付フォーマット（日本語形式）
    formatDate(dt) {
      const date = new Date(dt);
      return isNaN(date.getTime())
        ? ""
        : date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
    },
     // 最後の要素かどうか判定してバーの角丸処理に使う
     isLast(type) {
      const active = [];
      if (this.diary?.positive_score > 0) active.push('positive');
      if (this.diary?.neutral_score > 0) active.push('neutral');
      if (this.diary?.negative_score > 0) active.push('negative');

      return active[active.length - 1] === type;
    } 
  },
};
</script>

<style scoped>
.favorite-btn-wrapper {
  position: absolute;
  top: 0; /* カードの上端 */
  right: 0; /* カードの右端 */
  padding: 8px; /* 元の top/right マージンを再現 */
  
}
</style>

