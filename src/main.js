import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

// Vue-ECharts (Vue 2 用)
import VChart from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/title';

// グローバルコンポーネントとして登録
Vue.component('v-chart', VChart);

Vue.config.productionTip = false;

// localStorageからセッション復元追加
const savedSession = JSON.parse(localStorage.getItem('session'));
if (savedSession && savedSession.sessionId) {
  store.commit('setSession', savedSession); // Vuex に反映
}


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
