<template>
 
    <v-container fluid class="d-flex flex-column" style="height: 100vh; padding: 16px; overflow-x: hidden;">
      
      <!-- スクロール可能部分: タイトル + 色選択 -->
      <div 
        style="max-height: 65vh; overflow-y: auto; overflow-x: hidden; padding-bottom: 16px;"
      >
        <v-row justify="center">
          <v-col cols="12" class="text-center mb-4">
            <h1>ヘッダー色変更</h1>
          </v-col>

          <v-col cols="12" sm="10" md="8" class="text-center">
            <div class="mb-4">色を選択してください</div>

            <div v-for="(shades, base) in colorPalette" :key="base" class="mb-4 d-flex flex-wrap justify-center">
              <v-btn
                v-for="(shade, index) in shades"
                :key="index"
                :color="shade"
                class="ma-1"
                rounded
                fab
                small
                @click="selectedColor = shade"
              >
                <v-icon v-if="selectedColor === shade" color="white">mdi-check</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- 固定ボタン部分 -->
      <v-row justify="center" style="flex-shrink: 0; margin-top: 16px;">
        <v-col cols="12" sm="6" md="4" class="text-center">
          <v-btn color="primary" block @click="changeHeaderColor">
            変更する
          </v-btn>
          <v-btn text block class="mt-2" @click="goBack">戻る</v-btn>
        </v-col>
      </v-row>

    </v-container>
 
</template>

<script>
import axios from "axios";

export default {
  name: "HeaderColorChangeView",
  data() {
    return {
      // Vuetifyカラーのパレット
     colorPalette: {
      red: ["red lighten-4", "red lighten-3", "red lighten-2", "red lighten-1", "red", "red darken-1", "red darken-2"],
      pink: ["pink lighten-4", "pink lighten-3", "pink lighten-2", "pink lighten-1", "pink", "pink darken-1", "pink darken-2"],
      purple: ["purple lighten-4", "purple lighten-3", "purple lighten-2", "purple lighten-1", "purple", "purple darken-1", "purple darken-2"],
      "deep-purple": ["deep-purple lighten-4", "deep-purple lighten-3", "deep-purple lighten-2", "deep-purple lighten-1", "deep-purple", "deep-purple darken-1", "deep-purple darken-2"],
      indigo: ["indigo lighten-4", "indigo lighten-3", "indigo lighten-2", "indigo lighten-1", "indigo", "indigo darken-1", "indigo darken-2"],
      blue: ["blue lighten-4", "blue lighten-3", "blue lighten-2", "blue lighten-1", "blue", "blue darken-1", "blue darken-2"],
      "light-blue": ["light-blue lighten-4", "light-blue lighten-3", "light-blue lighten-2", "light-blue lighten-1", "light-blue", "light-blue darken-1", "light-blue darken-2"],
      cyan: ["cyan lighten-4", "cyan lighten-3", "cyan lighten-2", "cyan lighten-1", "cyan", "cyan darken-1", "cyan darken-2"],
      teal: ["teal lighten-4", "teal lighten-3", "teal lighten-2", "teal lighten-1", "teal", "teal darken-1", "teal darken-2"],
      green: ["green lighten-4", "green lighten-3", "green lighten-2", "green lighten-1", "green", "green darken-1", "green darken-2"],
      "light-green": ["light-green lighten-4", "light-green lighten-3", "light-green lighten-2", "light-green lighten-1", "light-green", "light-green darken-1", "light-green darken-2"],
      lime: ["lime lighten-4", "lime lighten-3", "lime lighten-2", "lime lighten-1", "lime", "lime darken-1", "lime darken-2"],
      amber: ["amber lighten-4", "amber lighten-3", "amber lighten-2", "amber lighten-1", "amber", "amber darken-1", "amber darken-2"],
      orange: ["orange lighten-4", "orange lighten-3", "orange lighten-2", "orange lighten-1", "orange", "orange darken-1", "orange darken-2"],
      "deep-orange": ["deep-orange lighten-4", "deep-orange lighten-3", "deep-orange lighten-2", "deep-orange lighten-1", "deep-orange", "deep-orange darken-1", "deep-orange darken-2"],
      brown: ["brown lighten-4", "brown lighten-3", "brown lighten-2", "brown lighten-1", "brown", "brown darken-1", "brown darken-2"],
      "blue-grey": ["blue-grey lighten-4", "blue-grey lighten-3", "blue-grey lighten-2", "blue-grey lighten-1", "blue-grey", "blue-grey darken-1", "blue-grey darken-2"]
    },

      selectedColor: "pink lighten-2", // デフォルト
      message: "",
      errorMessage: "",
      successDialog: false,
      errorDialog: false,
    };
  },
  mounted() {
    // ページロード時に現在のヘッダー色を selectedColor に設定
    const currentColor = this.$store.getters.currentUser.headerColor;
    if (currentColor) {
      this.selectedColor = currentColor;
    }
  },
  methods: {
    async changeHeaderColor() {
        if (!this.selectedColor) {
            this.errorMessage = "色を選択してください。";
            this.errorDialog = true;
            return;
        }

        try {
            const userId = this.$store.getters.currentUser.id;
            if (!userId) throw new Error("ユーザー情報が取得できません");

            const response = await axios.post(
            "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/UPDATEHEADERCOLOR",
            {
                ID: userId,
                HeaderColor: this.selectedColor,
            }
            );

            if (response.data?.result === "Succeeded") {
            // 成功メッセージを日本語化
            this.message = "ヘッダーの色を変更しました。";

            // Vuex 側のヘッダー色も更新
            this.$store.commit("setSession", {
                sessionId: this.$store.state.sessionId,
                userId: userId,
                userName: this.$store.state.userName,
                expiresAt: this.$store.state.expiresAt,
                headerColor: this.selectedColor,
                backgroundColor: this.$store.state.backgroundColor,
            });

            this.successDialog = true;
            this.errorMessage = "";
            } else {
            this.errorMessage = response.data?.message || "色変更に失敗しました。";
            this.errorDialog = true;
            }
        } catch (err) {
            this.errorMessage = "色変更エラー：" + (err.response?.data || err.message);
            this.errorDialog = true;
        }
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/diary");
      }
    },
  },
};
</script>
