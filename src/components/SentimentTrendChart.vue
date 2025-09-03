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
import VChart from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/grid";

export default {
  name: "SentimentTrendChart",
  components: { VChart },
  props: {
    trendData: {
      type: Object,
      required: true,
      default: () => ({ labels: [], scores: [] })
    }
  },
  computed: {
    chartOptions() {
      // ダークモード判定
      const isDark = this.$vuetify.theme.dark;
      const textColor = isDark ? "#ffffff" : "#000000";
      const splitLineColor = isDark ? "#444444" : "#cccccc";

      return {
        tooltip: { 
          trigger: "axis", 
          textStyle: { color: textColor } 
        },
        xAxis: {
          type: "category",
          data: this.trendData.labels,
          axisLabel: { fontSize: 14, color: textColor },
          axisLine: { lineStyle: { color: textColor } },
          splitLine: { lineStyle: { color: splitLineColor } }
        },
        yAxis: {
          type: "value",
          min: -1,
          max: 1,
          axisLabel: { fontSize: 14, color: textColor },
          axisLine: { lineStyle: { color: textColor } },
          splitLine: { lineStyle: { color: splitLineColor } }
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