<template>
  <v-container class="pa-4" max-width="900">
    <v-row>
      <v-col>
        <h1>下書き一覧</h1>
      </v-col>
    </v-row>

    <!-- 下書き一覧が1件以上あるとき表示 -->
    <v-row v-if="drafts.length > 0">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="drafts"
          :loading="loading"
          class="elevation-1"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template v-slot:item="{ item }">
            <tr>
              <!-- 作成日 -->
              <td>{{ formatDate(item.created_at_jst) }}</td>
              <!-- 本文（長すぎる場合は省略） -->
              <td>{{ truncateText(item.text, 30) }}</td>
              <td>
                <!-- 編集ボタン -->
                <v-tooltip bottom :open-delay="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="editDraft(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>編集</span>
                </v-tooltip>

                <!-- 削除ボタン -->
                <v-tooltip bottom :open-delay="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="deleteDraft(item.diary_id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>削除</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 下書きないとき -->
    <v-row v-else-if="!loading">
      <v-col>
        <v-alert type="info" dense outlined>
          下書きはありません。
        </v-alert>
      </v-col>
    </v-row>

    <!-- 戻るボタン -->
    <v-row>
      <v-col class="d-flex justify-end">
        <BackButton />
      </v-col>
    </v-row>

    <!-- エラー表示 -->
    <v-row v-if="error">
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
import BackButton from "@/components/BackButton.vue";

export default {
  name: "DraftListView",
  components: { BackButton },
  data() {
    return {
      drafts: [], // 下書き一覧データ
      loading: false, // 読み込み中フラグ
      sortBy: "created_at_jst", // ソート
      sortDesc: true, // 降順
      error: null, // エラーメッセージ
      headers: [
        { text: "作成日", value: "created_at_jst" },
        { text: "日記本文", value: "text" },
        { text: "操作", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    // 下書き一覧をAPIから取得
    async fetchDrafts() {
      this.loading = true;
      this.error = null;
      try {
        const userId = this.$store.state.userId;
        if (!userId) {
          this.error = "ユーザーIDが取得できません。ログイン状態を確認してください。";
          return;
        }

        const res = await axios.get(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/drafts",
          { params: { userId } }
        );

        this.drafts = res.data || [];
      } catch (err) {
        console.error(err);
        if (err.response) {
          this.error = `下書き取得エラー: ${JSON.stringify(err.response.data)}`;
        } else if (err.request) {
          this.error = "サーバーに応答がありません。";
        } else {
          this.error = "リクエストエラー: " + err.message;
        }
      } finally {
        this.loading = false;
      }
    },
    // 日付表示（年月日時分）
    formatDate(dt) {
      const date = new Date(dt);
      if (isNaN(date.getTime())) return "";
      return (
        date.toLocaleDateString("ja-JP") +
        " " +
        date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
      );
    },
    // 本文が長いときに省略
    truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    },
    // 編集画面へ遷移
    editDraft(item) {
      // DraftEditルートへ（idを渡す）
      this.$router.push({ name: "DraftEdit", params: { id: item.diary_id } });
    },

    // 下書きを削除
    async deleteDraft(diaryId) {
      if (!confirm("本当に削除しますか？")) return;
      try {
        const userId = this.$store.state.userId;
        await axios.delete(
          `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/${diaryId}`,
          { params: { userId } }
        );
        alert("削除しました");
        this.fetchDrafts();
      } catch (err) {
        console.error(err);
        alert("削除に失敗しました");
      }
    },
  },
  mounted() {
    // 初回読み込み時に一覧取得
    this.fetchDrafts();
  },
};
</script>
