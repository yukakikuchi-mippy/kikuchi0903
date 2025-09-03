<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar app :color="$store.getters.currentUser.headerColor || 'pink lighten-2'" dark>
      <!-- タイトル -->
      <v-toolbar-title class="app-title">
        MyDiary
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- ログイン時のみ表示 -->
      <div v-if="$store.getters.isLoggedIn" class="header-right">
        <!-- ユーザー名 -->
        <span class="username">{{ $store.getters.currentUser.name }} さん</span>

        <!-- ボタン -->
        <DiaryButton class="responsive-btn" />
        <DiarylistButton class="responsive-btn" />
        <StatisticsButton class="responsive-btn" />
        <LogoutButton class="responsive-btn" />

        <!-- 歯車アイコン -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="responsive-icon" v-bind="attrs" v-on="on">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$router.push({ name: 'ChangeName' })">
              <v-list-item-title>名前の変更</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push({ name: 'ChangePassword' })">
              <v-list-item-title>パスワードの変更</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push({ name: 'ChangeHeaderColor' })">
              <v-list-item-title>ヘッダー色変更</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push({ name: 'ChangeBackgroundColor' })">
              <v-list-item-title>背景色変更</v-list-item-title>
            </v-list-item>
            <v-list-item @click="switchLightDarkMode">
              <v-list-item-title>ライト/ダークモード切替</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- コンテンツ -->
    <v-main
      :style="{
        backgroundColor: $vuetify.theme.dark
          ? '#121212'
          : ($store.getters.currentUser.backgroundColor || 'white')
      }"
    >
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import LogoutButton from "@/components/LogoutButton.vue";
import DiarylistButton from "@/components/DiarylistButton.vue";
import DiaryButton from "@/components/DiaryButton.vue";
import StatisticsButton from "@/components/StatisticsButton.vue";

export default {
  name: "App",
  components: {
    LogoutButton,
    DiarylistButton,
    DiaryButton,
    StatisticsButton
  },
  methods: {
    switchLightDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: bold;
}

/* タイトル */
.app-title {
  font-size: 28px;
  font-weight: bold;
}

/* ボタン */
.responsive-btn {
  font-size: 16px;
  padding: 6px 12px;
}

/* 歯車アイコン */
.responsive-icon {
  font-size: 24px;
}

/* レスポンシブ */
@media (max-width: 1200px) {
  .app-title { font-size: 24px; }
  .responsive-btn { font-size: 14px; padding: 4px 10px; }
  .responsive-icon { font-size: 22px; }
}

@media (max-width: 800px) {
  .app-title { font-size: 20px; }
  .username { display: none; }
  .responsive-btn { font-size: 12px; padding: 2px 6px; }
  .responsive-icon { font-size: 20px; }
}

@media (max-width: 500px) {
  .app-title { font-size: 18px; }
  .responsive-btn { font-size: 10px; padding: 2px 4px; }
  .responsive-icon { font-size: 18px; }
}
</style>
