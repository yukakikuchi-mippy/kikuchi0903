<template>
  <v-container class="pa-4" max-width="600">
    <v-row>
      <v-col>
        <h1>日記を書く</h1>
      </v-col>
    </v-row>

    <!-- 入力フォーム -->
    <v-row>
      <v-col>
        <v-textarea
          v-model="message"
          label="今日の出来事や気持ちを書いてみましょう"
          auto-grow
          outlined
        ></v-textarea>
      </v-col>
    </v-row>

    <!-- ボタン群 -->
    <v-row>
      <v-col cols="6">
        <v-btn
          color="primary"
          :loading="loading"
          block
          @click="submitDiary"
        >
          投稿する
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          color="secondary"
          :loading="draftLoading"
          block
          @click="saveDraft"
          :disabled="!message.trim()"
        >
          下書きとして保存
        </v-btn>
      </v-col>
    </v-row>

    <!-- 下書き一覧ボタン -->
    <v-row class="mt-2">
      <v-col>
        <v-btn text color="primary" @click="goToDrafts">
          下書き一覧を見る
        </v-btn>
      </v-col>
    </v-row>

    <!-- AIコメント表示 -->
    <v-row v-if="response" class="mt-4">
      <v-col>
        <v-card outlined class="pa-2" style="position: relative;">
          <FavoriteButton
            v-if="response.diary_id"
            :diaryId="response.diary_id"
            :initialFavorite="response.is_favorite"
            @update="val => response.is_favorite = val"
            style="position: absolute; top: 8px; right: 8px;"
          />
          <v-card-title>AIからのコメント</v-card-title>
          <v-card-text>
            <p>{{ response.ai_text || "（AIからのコメントは生成されませんでした）" }}</p>
            <span>スコア: <SentimentDisplay :score="response.sentiment || 0" /></span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- エラー表示 -->
    <v-row v-if="error" class="mt-2">
      <v-col>
        <v-alert type="error" dense outlined>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import FavoriteButton from "@/components/FavoriteButton.vue";
import SentimentDisplay from "@/components/SentimentDisplay.vue";

export default {
  components: { FavoriteButton, SentimentDisplay },
  props: {
    id: { type: [String, Number], required: false } // 編集用下書きID
  },
  data() {
    return {
      localId: this.id || null,  // propsを直接編集せず内部で管理
      message: "",
      response: null,
      error: null,
      loading: false,
      draftLoading: false,
    };
  },
  computed: {
    isEdit() { return !!this.localId; },
  },
  async created() {
    // 編集モードなら下書き本文を取得
    if (this.isEdit) {
      const userId = this.$store.state.userId;
      try {
        const res = await axios.get(
          `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/drafts/${this.localId}`,
          { params: { userId } }
        );
        this.message = res.data?.text || "";
      } catch (e) {
        console.error(e);
        this.error = "下書きの取得に失敗しました。";
      }
    }
  },
  methods: {
    async submitDiary() {
  if (!this.message.trim()) {
    this.error = "日記を入力してください。";
    return;
  }
  this.error = null;
  this.loading = true;
  const userId = this.$store.state.userId;

  try {
    const apiUrl = this.isEdit
      ? `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/drafts/${this.localId}/publish`
      : "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/PostDiaryFunction";

    let res;
    if (this.isEdit) {
      // 下書きからの投稿
      res = await axios.put(apiUrl, { userId, message: this.message });
    } else {
      // 新規投稿
      res = await axios.post(apiUrl, { userId, message: this.message });
    }

    // レスポンスを受け取って表示
    this.response = res.data;

    // AIコメントの score が文字列や object になっている場合を Number に変換
    if (this.response?.sentiment != null) {
      this.response.sentiment = Number(this.response.sentiment) || 0;
    }

    this.$toast?.success("日記を投稿しました");

    // 投稿後は入力リセット・編集モード解除
    this.message = "";
    this.localId = null;
  } catch (err) {
    console.error(err);
    this.error = "投稿に失敗しました。";
  } finally {
    this.loading = false;
  }
},

    async saveDraft() {
      if (!this.message.trim()) return;
      this.error = null;
      this.draftLoading = true;
      const userId = this.$store.state.userId;

      try {
        if (this.isEdit) {
          // 既存下書きの本文だけ上書き（diary_id は変わらない）
          await axios.put(
            `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/drafts/${this.localId}`,
            { userId, message: this.message }
          );
          this.$toast?.success("下書きを更新しました");
        } else {
          // 新規下書き作成
          const res = await axios.post(
            "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/drafts",
            { userId, message: this.message }
          );
          this.localId = res.data?.diary_id; // 作成した下書きIDを保持
          this.$toast?.success("下書きを保存しました");
        }
      } catch (err) {
        console.error(err);
        this.error = "下書き保存に失敗しました。";
      } finally {
        this.draftLoading = false;
      }
    },

    goToDrafts() {
      this.$router.push({ name: "DraftList" });
    },
  },
};
</script>
