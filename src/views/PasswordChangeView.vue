<template>
  
    <v-container>
      <!-- タイトル -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>パスワード変更</h1>
        </v-col>
      </v-row>

      <!-- 入力フォーム -->
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="currentPassword"
            label="現在のパスワード"
            type="password"
            outlined
          />
          <v-text-field
            v-model="newPassword"
            label="新しいパスワード"
            type="password"
            outlined
          />
          <v-text-field
            v-model="confirmNewPassword"
            label="新しいパスワード（確認）"
            type="password"
            outlined
          />

          <v-btn color="primary" class="mt-4" block @click="changePassword">
            変更する
          </v-btn>
          <v-btn text class="mt-2" block @click="goBack">戻る</v-btn>
        </v-col>
      </v-row>

      <!-- エラー表示ダイアログ -->
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

      <!-- 成功表示ダイアログ -->
      <v-dialog v-model="successDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">成功</v-card-title>
          <v-card-text>{{ message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="goBack">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  
</template>

<script>
import axios from "axios";

export default {
  name: "PasswordChangeView",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      message: "",
      errorMessage: "",
      dialog: false,
      successDialog: false,
    };
  },
  methods: {
    async changePassword() {
      // 入力チェック
      if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
        this.errorMessage = "全ての項目を入力してください。";
        this.dialog = true;
        return;
      }

      if (this.newPassword !== this.confirmNewPassword) {
        this.errorMessage = "新しいパスワードが一致しません。";
        this.dialog = true;
        return;
      }

      try {
        const userId = this.$store.getters.currentUser.id;
        if (!userId) throw new Error("ユーザー情報が取得できません");

        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/UPDATEUSERPASSWORD",
          {
            UserId: userId,
            CurrentPassword: this.currentPassword,
            NewPassword: this.newPassword,
          }
        );

        this.message = response.data;
        this.successDialog = true;
        this.errorMessage = "";
      } catch (err) {
        this.errorMessage =
          "パスワード変更エラー：" + (err.response?.data || err.message);
        this.dialog = true;
      }
    },

    goBack() {
      // 履歴があれば前の画面に戻る。なければ /diary にフォールバック
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/diary");
      }
    },
  },
};
</script>
