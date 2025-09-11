<template>
  <v-container class="pa-4" max-width="900">
    <v-row>
      <v-col>
        <h1>日記一覧</h1>
      </v-col>
    </v-row>

    <!-- フィルター絞り込み -->
    <v-card class="mb-4 pa-4" outlined>
    <v-row class="mb-4" align="center" dense wrap>
       <!-- 絞り込みタイトル -->
  <v-col cols="12">
    <h3 class="mb-2">絞り込み</h3>
  </v-col>

  <!-- 日付 -->
  <v-col cols="12" sm="5" md="2">
    <v-menu
      v-model="dateMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="300"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          label="日付を選択"
          readonly
          v-model="filterDateText"
          dense
          clearable
          prepend-icon="mdi-calendar"
        ></v-text-field>
      </template>

      <v-card>
        <v-date-picker
          v-model="filterDate"
          @input="dateMenu = false"
          color="primary"
          show-current
        ></v-date-picker>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text small color="primary" @click="filterDate = null; dateMenu = false">
            クリア
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-col>

  <!-- 日付条件 -->
  <v-col cols="12" sm="3" md="2">
    <v-select
      v-model="filterDateType"
      :items="dateTypeOptions"
      label="日付の範囲"
      dense
      outlined
      hide-details
    ></v-select>
  </v-col>

  <!-- 感情 -->
  <v-col cols="12" sm="2" md="2">
    <v-select
      v-model="filterSentiment"
      :items="sentimentOptions"
      label="感情"
      clearable
      dense
      outlined
      hide-details
    ></v-select>
  </v-col>

  <!-- お気に入り -->
  <v-col cols="12" sm="2" md="2">
    <v-checkbox
      v-model="showFavoritesOnly"
      label="お気に入りのみ"
      dense
      hide-details
    ></v-checkbox>
  </v-col>

  <!-- クリアボタン -->
  <v-col cols="12" sm="2" md="1">
    <v-btn text small color="primary" @click="clearAllFilters" dense>クリア</v-btn>
  </v-col>
</v-row>
</v-card>

<v-row class="mb-0">
  <v-col cols="12">
    <p style="margin:0; font-size:0.9rem; color:#555;">
      日記をクリックして詳細を見る
    </p>
  </v-col>
</v-row>
    <!-- データテーブル -->
    <v-row class="mt-0">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filteredDiaries"
          :loading="loading"
          class="elevation-1"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template v-slot:item="{ item }">
            <tr>
              <!-- 作成日 -->
              <td>
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      @click="goToDetail(item)"
                      style="cursor: pointer;"
                    >
                      {{ formatDate(item.created_at_jst) }}
                    </span>
                  </template>
                  <span>もっと詳しく見る</span>
                </v-tooltip>
              </td>
              <!-- 日記本文 -->
              <td>
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      @click="goToDetail(item)"
                      style="cursor: pointer;"
                    >
                      {{ truncateText(item.text, 20) }}
                    </span>
                  </template>
                  <span>もっと詳しく見る</span>
                </v-tooltip>
              </td>
              <!-- AIコメント -->
              <td>
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      @click="goToDetail(item)"
                      style="cursor: pointer;"
                    >
                      {{ truncateText(item.ai_text, 20) }}
                    </span>
                  </template>
                  <span>もっと詳しく見る</span>
                </v-tooltip>
              </td>
              <!-- 感情スコア -->
              <td>
                <v-tooltip bottom open-delay="800">
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      @click="goToDetail(item)"
                      style="cursor: pointer;"
                    >
                      <SentimentDisplay :score="item.sentiment" />
                    </span>
                  </template>
                  <span>もっと詳しく見る</span>
                </v-tooltip>
              </td>
              <!-- 操作 -->
              <td>
                <div class="actions-column">
                <FavoriteButton
                  :diaryId="item.diary_id"
                  :initialFavorite="item.is_favorite"
                  @update="val => item.is_favorite = val"
                  @click.stop
                />
                 <!-- 削除ボタン -->
                <v-tooltip bottom :open-delay="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="confirmDelete(item.diary_id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>削除</span>
                </v-tooltip>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import FavoriteButton from "@/components/FavoriteButton.vue";
import SentimentDisplay from "@/components/SentimentDisplay.vue";

export default {
  name: "DiarylistView",
  components: { FavoriteButton, SentimentDisplay },
  data() {
    return {
      diaries: [],
      loading: false,
      error: null,
      // ソート設定
      sortBy: 'created_at_jst',
      sortDesc: true,
      headers: [
        { text: "作成日", value: "created_at_jst" },
        { text: "日記本文", value: "text" },
        { text: "AIコメント", value: "ai_text" },
        { text: "感情スコア", value: "sentiment" },
        { text: "操作", value: "actions", sortable: false },
      ],

      // フィルター用
      sentimentOptions: [
        "😊 (0.2以上)",
        "😐 (-0.2～0.2)",
        "😢 (-0.2以下)"
      ],
      filterSentiment: null,
      dateMenu: false,
      filterDate: null,
      filterDateText: "",
      dateTypeOptions: ["その日", "以前", "以降"],
      filterDateType: "その日",
      showFavoritesOnly: false,
    };
  },
  computed: {
    //しぼりこみした日記を返す
    filteredDiaries() {
      return this.diaries.filter(d => {
        let pass = true;

        // 感情スコアで絞り込み
        if (this.filterSentiment) {
          if (this.filterSentiment.startsWith("😊")) pass = d.sentiment > 0.2;
          else if (this.filterSentiment.startsWith("😐")) pass = d.sentiment >= -0.2 && d.sentiment <= 0.2;
          else if (this.filterSentiment.startsWith("😢")) pass = d.sentiment < -0.2;
        }

        // 日付で絞り込み（時間は無視して年月日だけ）
        if (this.filterDate) {
          const diaryDate = new Date(d.created_at_jst);
          const targetDate = new Date(this.filterDate);

          const diaryYMD = new Date(diaryDate.getFullYear(), diaryDate.getMonth(), diaryDate.getDate());
          const targetYMD = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

          if (this.filterDateType === "その日") {
            pass = pass && diaryYMD.getTime() === targetYMD.getTime();
          } else if (this.filterDateType === "以前") {
            pass = pass && diaryYMD.getTime() <= targetYMD.getTime(); // 選択日も含む
          } else if (this.filterDateType === "以降") {
            pass = pass && diaryYMD.getTime() >= targetYMD.getTime(); // 選択日も含む
          }
        }

        // お気に入り絞り込み
      if (this.showFavoritesOnly) {
        pass = pass && d.is_favorite;
      }

        return pass;
      });
    },
  },
  watch: {
    // 日付が選択されたらテキスト表示を更新
    filterDate(val) {
      this.filterDateText = val ? this.formatDateYMD(val) : "";
    },
  },
  methods: {
    // APIから日記一覧を取得
    async fetchDiaries() {
      this.loading = true;
      this.error = null;
      try {
        const userId = this.$store.state.userId;
        const res = await axios.get(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries",
          { params: { userId } }
        );
        this.diaries = res.data;
      } catch (err) {
        console.error(err);
        this.error = "日記の取得に失敗しました";
      } finally {
        this.loading = false;
      }
    },
    // 作成日や日付フィルター表示用（年月日）
    formatDateYMD(dt) {
      const date = new Date(dt);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("ja-JP");
    },
    // 詳細表示用（年月日時分）
    formatDate(dt) {
      const date = new Date(dt);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },
    // 本文・コメントを省略表示
    truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    },
     // 詳細画面へ遷移
    goToDetail(item) {
      this.$router.push({ name: "DiaryDetail", params: { id: item.diary_id } });
    },
    // 削除確認
    async confirmDelete(diaryId) {
      if (!confirm("本当に削除しますか？")) return;
      try {
        const userId = this.$store.state.userId;
        await axios.delete(
          `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/${diaryId}`,
          { params: { userId } }
        );
        alert("削除しました");
        this.fetchDiaries();
      } catch (err) {
        console.error(err);
        alert("削除に失敗しました");
      }
    },
    // フィルターをすべてクリア
     clearAllFilters() {
    this.filterDate = null;
    this.filterDateText = "";
    this.filterDateType = "その日";
    this.filterSentiment = null;
    this.showFavoritesOnly = false;
    }
  },
  mounted() {
    // 初回読み込み時に一覧取得
    this.fetchDiaries();
  },
};
</script>

<style scoped>

/* 操作ボタン横並び */
.actions-column {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  min-height: 48px; /* 行高さを確保 */
}

/* 画面幅が狭い場合（スマホなど） */
@media (max-width: 800px) {
  .actions-column {
    flex-direction: column; /* 縦並び */
    align-items: center;
  }
}

/* セルの最低高さを確保して縦幅を広く */
.v-data-table .v-data-table__wrapper tr td {
  min-height: 48px;
  vertical-align: middle;
}

</style>

