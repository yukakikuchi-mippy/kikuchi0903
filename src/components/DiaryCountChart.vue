<template>
  <v-card outlined class="pa-4" style="height: 360px;">
    <v-card-title>
      日記件数
      <v-spacer />
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
    diariesCount: { type: Object, required: true } // 初期値は親から渡す
  },
  data() {
    return {
      period: "day",
      localDiariesCount: { labels: [], counts: [] },
      periods: [
        { label: "日", value: "day" },
        { label: "週", value: "week" },
        { label: "月", value: "month" }
      ]
    };
  },
  computed: {
    chartOptions() {
      return {
        tooltip: {},
        xAxis: {
          type: "category",
          data: this.formatLabels(this.localDiariesCount.labels),
          axisLabel: { fontSize: 14 }
        },
        yAxis: { type: "value", axisLabel: { fontSize: 14 } },
        series: [
          {
            type: "bar",
            data: this.localDiariesCount.counts,
            itemStyle: { color: "#009b9f" },
            barWidth: 20
          }
        ]
      };
    }
  },
  watch: {
    diariesCount: {
      immediate: true,
      handler(newVal) {
        this.localDiariesCount = { ...newVal };
      }
    }
  },
  methods: {
    formatLabels(labels) {
      if (this.period === "day") {
        return labels.map(d => {
          const dt = new Date(d);
          return `${dt.getMonth() + 1}/${dt.getDate()}`;
        });
      } else if (this.period === "week") {
        return labels.map(w => {
          // API から "YYYY-WW" 形式で返ってくる場合、週番号だけを使う
          const weekNum = w.split("-W")[1] || w; // "-W" がなければそのまま
          return `${weekNum}W`;
        });
      } else if (this.period === "month") {
        return labels.map(m => {
          const [, month] = m.split("-");
          return `${parseInt(month, 10)}月`;
        });
      }
      return labels;
    },
    async changePeriod(p) {
      if (this.period === p) return;
      this.period = p;
      const userId = this.$store.state.userId;
      try {
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
