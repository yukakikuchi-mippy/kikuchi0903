<template>
  <v-card outlined class="pa-4" style="height: 360px;">
    <v-card-title>AIコメント感情内訳</v-card-title>
    <v-card-text style="display: flex; justify-content: flex-start;">
      <v-chart :options="chartOptions" style="height: 300px; width: 95%;" />
    </v-card-text>
  </v-card>
</template>

<script>
// Vue 2 用の vue-echarts v4 を想定
// main.js でグローバル登録済みなら import も不要
export default {
  name: "SentimentStatsChart",
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({ "😊": 0, "😐": 0, "😢": 0 })
    }
  },
  computed: {
    chartOptions() {
      return {
        tooltip: {},
        xAxis: {
          type: "category",
          data: ["😊", "😐", "😢"],
          axisLabel: { fontSize: 20 }
        },
        yAxis: {
          type: "value",
          axisLabel: { fontSize: 16 }
        },
        series: [
          {
            type: "bar",
            data: [
              this.stats["😊"] || 0,
              this.stats["😐"] || 0,
              this.stats["😢"] || 0
            ],
            itemStyle: { color: "#009b9f" },
            barWidth: 40
          }
        ]
      };
    }
  }
};
</script>
