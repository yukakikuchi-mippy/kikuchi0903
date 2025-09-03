<template>
  <v-container class="pa-4" max-width="900">
    <v-row>
      <v-col>
        <h1>統計</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <SentimentStatsChart :stats="sentimentStats" />
      </v-col>

      <v-col cols="12" md="6">
        <DiaryCountChart :diariesCount="diaries" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <SentimentTrendChart :trendData="sentimentTrend" />
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col>
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col>
        <v-alert type="error" outlined>{{ error }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import SentimentStatsChart from "@/components/SentimentStatsChart.vue";
import DiaryCountChart from "@/components/DiaryCountChart.vue";
import SentimentTrendChart from "@/components/SentimentTrendChart.vue";

export default {
  name: "StatisticsView",
  components: { SentimentStatsChart, DiaryCountChart, SentimentTrendChart },
  data() {
    return {
      sentimentStats: { "😊": 0, "😐": 0, "😢": 0 },
      diaries: { labels: [], counts: [] },
      sentimentTrend: { labels: [], scores: [] },
      loading: false,
      error: null
    };
  },
  async mounted() {
    this.loading = true;
    const userId = this.$store.state.userId;

    try {
      // 感情統計
      const res1 = await axios.get(
        "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/sentiment-stats",
        { params: { userId } }
      );
      this.sentimentStats = res1.data;

      // 日記件数
      const res2 = await axios.get(
        "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/count",
        { params: { userId, period: "day" } }
      );
      this.diaries = res2.data;

      // 感情スコア平均推移（直近2週間）
      const res3 = await axios.get(
        "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/sentiment-trend",
        { params: { userId } }
      );

      // API が { labels: [...], averages: [...] } の場合
      const data = res3.data;
      this.sentimentTrend.labels = data.labels.map(d => {
        const dt = new Date(d);
        return `${dt.getMonth() + 1}/${dt.getDate()}`;
      });
      this.sentimentTrend.scores = data.averages.map(v => v !== null ? v : null);

    } catch (err) {
      console.error(err);
      this.error = "統計データの取得に失敗しました";
    } finally {
      this.loading = false;
    }
  }
};
</script>
