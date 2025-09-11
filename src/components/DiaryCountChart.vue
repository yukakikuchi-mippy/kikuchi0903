<template>
  <v-card outlined class="pa-4" style="height: 360px;">
    <v-card-title>
      日記件数
      <v-spacer />
       <!-- 期間切替ボタン（日・週・月） -->
      <v-btn
        v-for="p in periods"
        :key="p.value"
        small
        outlined
        :color="period === p.value ? 'primary' : 'grey'"
        @click="changePeriod(p.value)"
      >
        {{ p.label }}
      </v-btn>
    </v-card-title>

     <!-- グラフ部分 -->
    <v-card-text style="display: flex; justify-content: flex-start;">
      <v-chart :options="chartOptions" style="height: 300px; width: 95%;" />
    </v-card-text>
  </v-card>
</template>

<script>
import VChart from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/grid";
import axios from "axios";

export default {
  name: "DiaryCountChart",
  components: { VChart },
  props: {
    // 親から渡される件数データ { labels: [], counts: [] }
    diariesCount: { type: Object, required: true, default: () => ({ labels: [], counts: [] }) }
  },
  data() {
    return {
      // 現在の表示単位（日/週/月）
      period: "day",
      // ローカルで保持する件数データ（APIから取得）
      localDiariesCount: { labels: [], counts: [] },
      // 切替ボタン用のリスト
      periods: [
        { label: "日", value: "day" },
        { label: "週", value: "week" },
        { label: "月", value: "month" }
      ]
    };
  },
  computed: {
    // グラフの設定
    chartOptions() {
      const isDark = this.$vuetify.theme.dark; // 個別ダークモード対応
      const textColor = isDark ? "#ffffff" : "#000000";
      const splitLineColor = isDark ? "#444444" : "#cccccc";

      return {
        tooltip: { textStyle: { color: textColor } },
        xAxis: {
          // 横軸
          type: "category",
          data: this.formatLabels(this.localDiariesCount.labels),// ラベル
          axisLabel: { fontSize: 14, color: textColor }, //軸の文字
          axisLine: { lineStyle: { color: textColor } }, // 軸の線の色
          splitLine: { lineStyle: { color: splitLineColor } } // 補助線
        },
        yAxis: {
          // 縦軸
          type: "value",
          axisLabel: { fontSize: 14, color: textColor }, // 横軸とスタイルは同じ
          axisLine: { lineStyle: { color: textColor } },
          splitLine: { lineStyle: { color: splitLineColor } }
        },
        series: [
          {
            type: "bar", // 棒グラフ
            data: this.localDiariesCount.counts,
            itemStyle: { color: "#009b9f" }, // 色
            barWidth: 20 // 棒の太さ
          }
        ]
      };
    }
  },
  watch: {
    // 親の props が更新されたら local に反映
    diariesCount: {
      immediate: true,
      handler(newVal) {
        this.localDiariesCount = { ...newVal };
      }
    }
  },
  methods: {
    // ラベル（日付や週番号や月）を表示用に整形
    formatLabels(labels) {
      if (this.period === "day") {
        return labels.map(d => {
          const dt = new Date(d);
          return `${dt.getMonth() + 1}/${dt.getDate()}`; // 9/10 みたいに表示
        });
      } else if (this.period === "week") {
        return labels.map(w => {
          const weekNum = w.split("-W")[1] || w;
          return `${weekNum}W`; //10W のように表示
        });
      } else if (this.period === "month") {
        return labels.map(m => {
          const [, month] = m.split("-");
          return `${parseInt(month, 10)}月`; // 9月 のように表示
        });
      }
      return labels;
    },
    // 期間切替（日/週/月）
    async changePeriod(p) {
      if (this.period === p) return;
      this.period = p;
      const userId = this.$store.state.userId;
      try {
        // API から新しい件数データを取得
        const res = await axios.get(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/count",
          { params: { userId, period: p } }
        );
        this.localDiariesCount = res.data;
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
