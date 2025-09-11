<template>
  <v-app>
    <v-container>
      <!-- タイトル -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>ユーザー登録</h1>
        </v-col>
      </v-row>

      <!-- ユーザー情報入力フォーム -->
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="userid" label="ユーザーID" outlined />
          <v-text-field v-model="password" label="パスワード" type="password" outlined />
          <v-text-field v-model="displayName" label="表示名" outlined />

          <v-btn color="primary" class="mt-4" block @click="signup">登録</v-btn>
          <v-btn text class="mt-2" block @click="goToLogin">ログインに戻る</v-btn>
        </v-col>
      </v-row>

      <!-- エラー表示 -->
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

      <!-- 成功表示 -->
      <v-dialog v-model="successDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">成功</v-card-title>
          <v-card-text>{{ message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="goToLogin">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "SignupView",
  data() {
    return {
      userid: "",        // 入力されたユーザーID
      password: "",      // 入力されたパスワード
      displayName: "",   // 入力された表示名
      message: "",       // 成功時のメッセージ
      errorMessage: "",  // エラーメッセージ
      dialog: false,     // エラーダイアログ表示フラグ
      successDialog: false // 成功ダイアログ表示フラグ
    };
  },
  methods: {
    // ユーザー登録処理
    async signup() {
      if (!this.userid || !this.password || !this.displayName) {
        this.errorMessage = "全ての項目を入力してください。";
        this.dialog = true;
        return;
      }

      try {
        // APIにリクエスト送信
        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/INSERTUSER?",
          {
            ID: this.userid,
            Password: this.password,
            Name: this.displayName
          }
        );

        // 成功メッセージ
        this.message = response.data;
        this.successDialog = true; // 成功ダイアログを表示
        this.errorMessage = "";
      } catch (err) {
        // エラー処理
        this.errorMessage = "登録エラー：" + (err.response?.data || err.message);
        this.dialog = true;
      }
    },
    // ログイン画面に戻る
    goToLogin() {
      this.$router.push("/");
    }
  }
};
</script>
