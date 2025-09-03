<template>
  <v-card outlined class="pa-4" style="height: 360px;">
    <v-card-title>AIコメント感情内訳</v-card-title>
    <v-card-text style="display: flex; justify-content: flex-start;">
      <v-chart :options="chartOptions" style="height: 300px; width: 95%;" />
    </v-card-text>
  </v-card>
</template>

<script>
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
      const isDark = this.$vuetify.theme.dark;
      const textColor = isDark ? "#ffffff" : "#000000";
      const splitLineColor = isDark ? "#444444" : "#cccccc";

      return {
        tooltip: { textStyle: { color: textColor } },
        xAxis: {
          type: "category",
          data: ["😊", "😐", "😢"],
          axisLabel: { fontSize: 20, color: textColor },
          axisLine: { lineStyle: { color: textColor } },
          splitLine: { lineStyle: { color: splitLineColor } }
        },
        yAxis: {
          type: "value",
          axisLabel: { fontSize: 16, color: textColor },
          axisLine: { lineStyle: { color: textColor } },
          splitLine: { lineStyle: { color: splitLineColor } }
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
