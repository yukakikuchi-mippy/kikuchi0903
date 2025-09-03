<template>
   <v-card outlined class="pa-4" style="height: 360px;">
    <v-card-title>AIコメント感情内訳</v-card-title>
    <v-card-text style="display: flex; justify-content: flex-start;">
        <v-chart :options="chartOptions" style="height: 300px; width: 95%;" />
    </v-card-text>
   </v-card>
</template>

<script>
import VChart from "vue-echarts";
import "echarts/lib/chart/bar";           // bar チャート
import "echarts/lib/component/tooltip";   // tooltip
import "echarts/lib/component/title";     // title
import "echarts/lib/component/grid";      // grid

export default {
  name: "SentimentStatsChart",
  components: { VChart },
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartOptions() {
        return {
            tooltip: {},
            xAxis: {
            type: "category",
            data: ["😊", "😐", "😢"],
            axisLabel: {
                fontSize: 20  // 横軸ラベル（絵文字）のサイズ
            }
            },
            yAxis: {
            type: "value",
            axisLabel: {
                fontSize: 16  // 縦軸の数値のサイズ
            }
            },
            series: [{
            type: "bar",
            data: [
                this.stats["😊"] || 0,
                this.stats["😐"] || 0,
                this.stats["😢"] || 0
            ],
            itemStyle: { color: "#009b9f" },
            barWidth: 40,
            }]
        };
        }
  }
};
</script>
