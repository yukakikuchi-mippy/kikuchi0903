<template>
 
    <v-container>
      <!-- タイトル -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1>名前変更</h1>
        </v-col>
      </v-row>

      <!-- 入力フォーム -->
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="newName"
            label="新しい名前"
            outlined
          />

          <v-btn color="primary" class="mt-4" block @click="changeName">
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
  name: "NameChangeView",
  data() {
    return {
      newName: "",
      message: "",
      errorMessage: "",
      dialog: false,
      successDialog: false,
    };
  },
  methods: {
    async changeName() {
      try {
        const userId = this.$store.getters.currentUser.id;
        if (!userId) throw new Error("ユーザー情報が取得できません");
        if (!this.newName) {
          this.errorMessage = "新しい名前を入力してください。";
          this.dialog = true;
          return;
        }

        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/UPDATEUSERNAME",
          {
            ID: userId,
            NewName: this.newName,
          }
        );

        // 成功
        this.message = response.data?.Message || "名前を変更しました。";

        this.$store.commit("setSession", {
                sessionId: this.$store.state.sessionId,
                userId: userId,
                userName: this.newName,
                expiresAt: this.$store.state.expiresAt,
                headerColor: this.$store.state.headerColor,
                backgroundColor: this.$store.state.backgroundColor,
            });

        this.successDialog = true;
        this.errorMessage = "";
      } catch (err) {
        this.errorMessage =
          "名前変更エラー：" + (err.response?.data || err.message);
        this.dialog = true;
      }
    },
    goBack() {
      // 元の画面に戻る
      this.$router.back();
    },
  },
};
</script>
