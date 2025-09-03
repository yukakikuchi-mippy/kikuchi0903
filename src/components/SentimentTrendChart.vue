<template>
  <v-card outlined class="pa-4">
    <v-card-title>感情スコア平均推移（直近2週間）</v-card-title>
    <v-card-text>
      <v-chart
        v-if="trendData.labels.length"
        :options="chartOptions"
        style="height: 300px; width: 100%;"
      />
      <div v-else>データがありません</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SentimentTrendChart",
  props: {
    trendData: {
      type: Object,
      required: true,
      default: () => ({ labels: [], scores: [] })
    }
  },
  computed: {
    chartOptions() {
      return {
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          data: this.trendData.labels,
          axisLabel: { fontSize: 14 }
        },
        yAxis: {
          type: "value",
          min: -1,
          max: 1,
          axisLabel: { fontSize: 14 }
        },
        series: [
          {
            type: "line",
            data: this.trendData.scores,
            smooth: true,
            connectNulls: true,
            lineStyle: { color: "#ff5722" },
            itemStyle: { color: "#ff5722" }
          }
        ]
      };
    }
  }
};
</script>
