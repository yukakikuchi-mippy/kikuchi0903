<template>
  
  <v-btn text color=white @click="logout" :small="small">ログアウト</v-btn>
  
</template>

<script>
import axios from "axios";

export default {
  name: "LogoutButton",
  props: {
    small: { type: Boolean, default: false }
  },
  methods: {
    async logout() {
      try {
        const sessionId = this.$store.state.sessionId; // ✅ 修正済み

        if (!sessionId) {
          alert("セッションが見つかりません。ログインし直してください。");
          this.$store.dispatch("logout");
          if (this.$route.path !== "/login") {
            this.$router.push("/login");
          }
          return;
        }

        // 🔹 サーバーにログアウトリクエスト
        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/Logout?",
           { SessionId: sessionId } 
        );

        if (response.status === 200) {
          // ✅ Vuex のセッション削除
          this.$store.dispatch("logout");

          // ✅ Cookie 削除
          document.cookie = "session_id=; Max-Age=0; path=/;";

          // ✅ ログインページに遷移
          if (this.$route.path !== "/login") {
            this.$router.push("/login");
          }
        } else {
          alert("ログアウトに失敗しました");
        }
      } catch (error) {
        console.error("ログアウト失敗:", error.response?.data || error.message);
        alert("ログアウトに失敗しました");
      }
    }
  }
};
</script>
