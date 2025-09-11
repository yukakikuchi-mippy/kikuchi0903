<template>
  <!-- ログアウトボタン。クリックすると logout メソッドを実行 -->
  <v-btn text color="white" @click="logout" :small="small">
    ログアウト
  </v-btn>
</template>

<script>
import axios from "axios";

export default {
  name: "LogoutButton",
  methods: {
    async logout() {
      try {
        // Vuex ストアから現在のセッションIDを取得
        const sessionId = this.$store.state.sessionId;

        // 1. Vuex のセッション情報をクリア & localStorage もクリア
        this.$store.dispatch('logout');
        // クッキーに保存されていた session_id も削除
        document.cookie = "session_id=; Max-Age=0; path=/;";

        // 2. サーバー側にも「ログアウト」を通知（セッションIDがあれば）
        if (sessionId) {
          await axios.post(
            "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/Logout",
            { SessionId: sessionId }
          );
        }

        // 3. 現在のルートがログインページでなければ、ログイン画面にリダイレクト
        if (this.$route.name !== 'login') {
          this.$router.replace({ name: 'login' });
        }
      } catch (error) {
        // エラー処理：API からのレスポンスか、一般エラーメッセージを表示
        console.error("ログアウト失敗:", error.response?.data || error.message);
        alert("ログアウトに失敗しました");
      }
    }
  }
};
</script>

<style scoped>
::v-deep(.v-btn__content) {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
</style>

