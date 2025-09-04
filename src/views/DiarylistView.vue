<template>
  <v-container class="pa-4" max-width="900">
    <v-row>
      <v-col>
        <h1>日記一覧</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center" dense wrap>
  <!-- 日付 -->
  <v-col cols="6" sm="3" md="2">
    <v-menu
      v-model="dateMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          label="日付"
          readonly
          v-model="filterDateText"
          dense
          clearable
        ></v-text-field>
      </template>
      <v-card>
        <v-date-picker v-model="filterDate" @input="dateMenu = false"></v-date-picker>
        <v-card-actions>
          <v-btn text dense @click="filterDate = null; dateMenu = false">クリア</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-col>

  <!-- 日付条件 -->
  <v-col cols="6" sm="2" md="2">
    <v-select
      v-model="filterDateType"
      :items="dateTypeOptions"
      label="条件"
      dense
    ></v-select>
  </v-col>

  <!-- 感情 -->
  <v-col cols="6" sm="2" md="2">
    <v-select
      v-model="filterSentiment"
      :items="sentimentOptions"
      label="感情"
      clearable
      dense
    ></v-select>
  </v-col>

  <!-- お気に入り -->
  <v-col cols="6" sm="2" md="2">
    <v-checkbox
      v-model="showFavoritesOnly"
      label="お気に入りのみ"
      dense
      hide-details
    ></v-checkbox>
  </v-col>

  <!-- クリアボタン -->
  <v-col cols="6" sm="2" md="2">
    <v-btn text small color="primary" @click="clearAllFilters" dense>クリア</v-btn>
  </v-col>
</v-row>

    <!-- データテーブル -->
    <v-row>
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
                <FavoriteButton
                  :diaryId="item.diary_id"
                  :initialFavorite="item.is_favorite"
                  @update="val => item.is_favorite = val"
                  @click.stop
                />
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
    filterDate(val) {
      this.filterDateText = val ? this.formatDateYMD(val) : "";
    },
  },
  methods: {
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
    // 作成日や日付フィルター表示用（時間なし）
    formatDateYMD(dt) {
      const date = new Date(dt);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("ja-JP");
    },
    // 詳細表示用（時間あり）
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
    truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    },
    goToDetail(item) {
      this.$router.push({ name: "DiaryDetail", params: { id: item.diary_id } });
    },
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
     clearAllFilters() {
    this.filterDate = null;
    this.filterDateText = "";
    this.filterDateType = "その日";
    this.filterSentiment = null;
    this.showFavoritesOnly = false;
    }
  },
  mounted() {
    this.fetchDiaries();
  },
};
</script>
