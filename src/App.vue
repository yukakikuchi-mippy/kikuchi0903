<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar app :color="$store.getters.currentUser.headerColor || 'pink lighten-2'" dark>
      <v-toolbar-title class="app-title">MyDiary</v-toolbar-title>
      <v-spacer />

      <!-- 大画面用 -->
      <div v-if="$store.getters.isLoggedIn && !isMobile" class="header-right">
        <span class="username">{{ $store.getters.currentUser.name }} さん</span>
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
            <v-list-item :to="{ name: 'ChangeName' }">
              <v-list-item-title>名前の変更</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'ChangePassword' }">
              <v-list-item-title>パスワードの変更</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'ChangeHeaderColor' }">
              <v-list-item-title>ヘッダー色変更</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'ChangeBackgroundColor' }">
              <v-list-item-title>背景色変更</v-list-item-title>
            </v-list-item>
            <v-list-item @click="switchLightDarkMode">
              <v-list-item-title>ライト/ダークモード切替</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- モバイル用 -->
      <div v-else-if="$store.getters.isLoggedIn && isMobile" class="mobile-right">
        <span class="username">{{ $store.getters.currentUser.name }} さん</span>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
    </v-app-bar>

    <!-- モバイルドロワー -->
    <v-navigation-drawer v-model="drawer" app temporary right>
      <v-list dense>
        <v-list-item :to="{ name: 'diary' }" @click="closeDrawer">
          <v-list-item-title>日記投稿</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'diarylist' }" @click="closeDrawer">
          <v-list-item-title>日記一覧</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Statistics' }" @click="closeDrawer">
          <v-list-item-title>統計</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>ログアウト</v-list-item-title>
        </v-list-item>

        <v-list-group
          :prepend-icon="!isMobile ? 'mdi-cog' : ''"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>設定</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item :to="{ name: 'ChangeName' }" @click="closeDrawer">
            <v-list-item-title>名前の変更</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ChangePassword' }" @click="closeDrawer">
            <v-list-item-title>パスワードの変更</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ChangeHeaderColor' }" @click="closeDrawer">
            <v-list-item-title>ヘッダー色変更</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'ChangeBackgroundColor' }" @click="closeDrawer">
            <v-list-item-title>背景色変更</v-list-item-title>
          </v-list-item>
          <v-list-item @click="switchLightDarkMode">
            <v-list-item-title>ライト/ダークモード切替</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- コンテンツ -->
    <v-main :style="{ backgroundColor: $vuetify.theme.dark ? '#121212' : ($store.getters.currentUser.backgroundColor || 'white') }">
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
  components: { LogoutButton, DiarylistButton, DiaryButton, StatisticsButton },
  data() {
    return { drawer: false, isMobile: false };
  },
  mounted() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);

    // ページ読み込み時に localStorage からダークモード状態を復元
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode !== null) {
      this.$vuetify.theme.dark = darkMode === "true";
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreen);
  },
  methods: {
    checkScreen() {
      this.isMobile = window.innerWidth <= 800;
    },
    switchLightDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      // ダークモード状態を localStorage に保存
      localStorage.setItem("darkMode", this.$vuetify.theme.dark);
      if (this.isMobile) this.drawer = false; // ドロワーを閉じる
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "login" });
      if (this.isMobile) this.drawer = false;
    },
    closeDrawer() {
      if (this.isMobile) this.drawer = false;
    },
  },
};
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto; /* ハンバーガーとユーザー名を右寄せ */
}

.username { font-weight: bold; }
.app-title { font-size: 28px; font-weight: bold; flex-shrink: 0; }
.responsive-btn { font-size: 16px; padding: 6px 12px; }
.responsive-icon { font-size: 24px; }

@media (max-width: 1200px) {
  .app-title { font-size: 24px; }
  .responsive-btn { font-size: 14px; padding: 4px 10px; }
  .responsive-icon { font-size: 22px; }
}
@media (max-width: 800px) {
  .app-title { font-size: 20px; }
  .responsive-btn { font-size: 12px; padding: 2px 6px; }
  .responsive-icon { font-size: 20px; }
}
@media (max-width: 500px) {
  .app-title { font-size: 18px; }
  .responsive-btn { font-size: 10px; padding: 2px 4px; }
  .responsive-icon { font-size: 18px; }
}
</style>
