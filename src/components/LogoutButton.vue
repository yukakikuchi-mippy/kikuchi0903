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
    const sessionId = this.$store.state.sessionId;

    // Vuex と localStorage をクリア
    this.$store.dispatch('logout');
    document.cookie = "session_id=; Max-Age=0; path=/;";

    // サーバーに通知（sessionId があれば）
    if (sessionId) {
      await axios.post(
        "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/Logout",
        { SessionId: sessionId }
      );
    }

    // ログインページに遷移
    if (this.$route.name !== 'login') {
      this.$router.replace({ name: 'login' });
    }
  } catch (error) {
    console.error("ログアウト失敗:", error.response?.data || error.message);
    alert("ログアウトに失敗しました");
  }
}

  }
};
</script>
