<template>
  <v-app>
    <v-container>
      <!-- タイトル -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>ログイン</h1>
        </v-col>
      </v-row>

      <!-- 入力フォーム -->
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <!-- ユーザー名入力欄 -->
          <v-text-field 
            v-model="userid" 
            label="ユーザーID" 
            outlined
            autocomplete="off"
          />

          <!-- パスワード入力欄 -->
          <v-text-field 
            v-model="password" 
            label="パスワード" 
            type="password" 
            outlined
            autocomplete="off"
          />

          <!-- ログインボタン -->
          <v-btn color="primary" class="mt-4" block @click="login">ログイン</v-btn>

          <!-- サインアップボタン -->
          <v-btn text class="mt-2" block @click="goToSignup">新規登録はこちら</v-btn>
        </v-col>
      </v-row>

      <!-- エラーダイアログ -->
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="headline">エラー</v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      userid: "",
      password: "",
      errorMessage: "",
      dialog: false
    };
  },
  mounted() {
    // ページに入るたびに必ずフォーム初期化
    this.userid = "";
    this.password = "";
  },
  methods: {
    async login() {
      if (!this.userid || !this.password) {
        this.errorMessage = "ユーザーIDとパスワードを入力してください。";
        this.dialog = true;
        return;
      }

      try {
        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/LOGIN?",
          {
            ID: this.userid,
            Password: this.password
          }
        );

        if (response.status === 200 && response.data?.result === "Succeeded") {
          const sessionResponse = await axios.post(
            "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/CreateSession?",
            {
              UserId: this.userid,
              UserName: response.data.userName
            }
          );

          if (sessionResponse.status === 200) {
            // ✅ Vuexにセッション保存
            this.$store.commit("setSession", {
              sessionId: sessionResponse.data.sessionId,
              userId: this.userid,
              userName: response.data.userName,
              expiresAt: sessionResponse.data.expiresAt || null,
              headerColor: response.data.headerColor || "pink lighten-2",
              backgroundColor: response.data.backgroundColor || "white"
            });

            // localStorage にも保存
            localStorage.setItem("session", JSON.stringify(this.$store.state));

            // ✅ Cookieにも保存（サーバー確認用）
            document.cookie = `session_id=${encodeURIComponent(
              sessionResponse.data.sessionId
            )}; path=/; secure; samesite=strict`;

            // ✅ 日記ページに遷移
            this.$router.replace("/diary");
          } else {
            this.errorMessage = "セッションの生成に失敗しました。";
            this.dialog = true;
          }
        } else {
          this.errorMessage = "ユーザーIDまたはパスワードが正しくありません。";
          this.dialog = true;
        }
      } catch (err) {
        console.error("ログインエラー:", err);
        this.errorMessage = "ユーザーIDまたはパスワードが正しくありません。";
        this.dialog = true;
      }
    },
    goToSignup() {
      this.$router.push("/signup");
    }
  }
};
</script>
