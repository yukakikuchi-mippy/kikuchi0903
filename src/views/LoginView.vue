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

          <!-- 新規登録ボタン -->
          <v-btn text class="mt-2" block @click="goToSignup">新規登録はこちら</v-btn>
        </v-col>
      </v-row>

      <!-- エラー表示-->
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
      userid: "", // 入力中のユーザーID
      password: "", // 入力中のパスワード
      errorMessage: "", // エラーメッセージ
      dialog: false // エラーダイアログ表示フラグ
    };
  },
  mounted() {
    // ページに入るたびにフォーム初期化
    this.userid = "";
    this.password = "";
  },
  methods: {
    // ログイン処理
    async login() {
      // 入力チェック
      if (!this.userid || !this.password) {
        this.errorMessage = "ユーザーIDとパスワードを入力してください。";
        this.dialog = true;
        return;
      }

      try {
        // 認証API呼び出し
        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/LOGIN?",
          {
            ID: this.userid,
            Password: this.password
          }
        );

        // 認証成功した場合
        if (response.status === 200 && response.data?.result === "Succeeded") {
          // サーバー側でセッションを作成
          const sessionResponse = await axios.post(
            "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/CreateSession?",
            {
              UserId: this.userid,
              UserName: response.data.userName
            }
          );

          if (sessionResponse.status === 200) {
            // Vuexにセッション保存
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

            // Cookieにも保存（サーバー確認用）
            document.cookie = `session_id=${encodeURIComponent(
              sessionResponse.data.sessionId
            )}; path=/; secure; samesite=strict`;

            // 日記ページに遷移
            this.$router.replace("/diary");
          } else {
            this.errorMessage = "セッションの生成に失敗しました。";
            this.dialog = true;
          }
        } else {
           // 認証失敗時
          this.errorMessage = "ユーザーIDまたはパスワードが正しくありません。";
          this.dialog = true;
        }
      } catch (err) {
        // ネットワークエラーやAPIエラー時
        console.error("ログインエラー:", err);
        this.errorMessage = "ユーザーIDまたはパスワードが正しくありません。";
        this.dialog = true;
      }
    },
    // 新規登録画面へ遷移
    goToSignup() {
      this.$router.push("/signup");
    }
  }
};
</script>
