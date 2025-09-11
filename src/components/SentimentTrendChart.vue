<template>
  <v-card outlined class="pa-4">
    <v-card-title>感情スコア平均（直近2週間）</v-card-title>
    <v-card-text>
       <!-- データがある場合のみグラフ表示 -->
      <v-chart
        v-if="trendData.labels.length"
        :options="chartOptions"
        style="height: 300px; width: 100%;"
      />
      <!-- データがない場合の表示 -->
      <div v-else>データがありません</div>
    </v-card-text>
  </v-card>
</template>

<script>
import VChart from "vue-echarts";
import "echarts/lib/chart/line"; // 折れ線グラフ
import "echarts/lib/component/tooltip"; // ツールチップ
import "echarts/lib/component/grid"; // 補助線


export default {
  name: "SentimentTrendChart",
  components: { VChart },
  props: {
    // 親コンポーネントから渡される直近2週間のラベルとスコア
    trendData: {
      type: Object,
      required: true,
      default: () => ({ labels: [], scores: [] })
    }
  },
  computed: {
    chartOptions() {
      // ダークモード
      const isDark = this.$vuetify.theme.dark;
      const textColor = isDark ? "#ffffff" : "#000000";
      const splitLineColor = isDark ? "#444444" : "#cccccc";

      return {
        // ツールチップ
        tooltip: { 
          trigger: "axis", // 横軸に沿って表示
          textStyle: { color: textColor } 
        },
        xAxis: {
          type: "category",
          data: this.trendData.labels,
          axisLabel: { fontSize: 14, color: textColor },
          axisLine: { lineStyle: { color: textColor } },
          splitLine: { lineStyle: { color: splitLineColor } }
        },
        // 縦軸（感情スコア -1～1）
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
            type: "line", // 折れ線グラフ
            data: this.trendData.scores,
            smooth: true, // 線を滑らかに
            connectNulls: true, // nullを線で接続
            lineStyle: { color: "#ff5722" }, // 線の色
            itemStyle: { color: "#ff5722" } // データポイントの色
          }
        ]
      };
    }
  }
};
</script>